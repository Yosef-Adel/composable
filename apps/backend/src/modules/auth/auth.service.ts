import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { AuditService } from '../audit/audit.service';
import { AuditAction } from '../audit/audit-log.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './types/jwt-payload.type';
import { User, UserRole } from '../users/user.schema';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
    isEmailVerified: boolean;
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly otpExpirationMinutes = 10;
  private readonly saltRounds = 12;
  private readonly coreOnly: boolean;
  private readonly otpResendCooldownMinutes = 1;
  private otpResendAttempts: Map<string, number> = new Map(); // email -> timestamp
  private readonly otpResendCleanupInterval = 5 * 60 * 1000; // 5 minutes

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
    private auditService: AuditService,
  ) {
    this.coreOnly = this.configService.get<string>('CORE_ONLY') === 'true';

    // Periodically clean up expired rate-limit entries to prevent memory leak
    setInterval(() => {
      const now = Date.now();
      const cooldownMs = this.otpResendCooldownMinutes * 60 * 1000;
      for (const [email, timestamp] of this.otpResendAttempts) {
        if (now - timestamp > cooldownMs) {
          this.otpResendAttempts.delete(email);
        }
      }
    }, this.otpResendCleanupInterval);
  }

  /**
   * Register a new user
   */
  async register(
    registerDto: RegisterDto,
  ): Promise<{ userId: string; message: string }> {
    const { name, email, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    // Create user
    const user = await this.usersService.create(name, email, hashedPassword);

    // In CORE_ONLY (self-hosted) mode, skip email verification
    if (this.coreOnly) {
      await this.usersService.verifyEmail(user._id.toString());
      return {
        userId: user._id.toString(),
        message: 'User registered successfully. You can now log in.',
      };
    }

    // Generate and send OTP
    await this.generateAndSendOtp(user);

    return {
      userId: user._id.toString(),
      message: 'User registered successfully. Check your email for OTP.',
    };
  }

  /**
   * Login user and return access token
   */
  async login(loginDto: LoginDto, ip?: string, userAgent?: string): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new BadRequestException(
        'Please verify your email before logging in',
      );
    }

    // Generate tokens
    const { accessToken, refreshToken, refreshTokenHash } =
      await this.generateTokens(user._id.toString(), user.email, user.roles);

    // Store refresh token hash
    await this.usersService.updateRefreshTokenHash(
      user._id.toString(),
      refreshTokenHash,
    );

    // Audit log
    await this.auditService.log({
      userId: user._id.toString(),
      action: AuditAction.LOGIN,
      ip,
      userAgent,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        roles: user.roles,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  /**
   * Verify OTP and mark email as verified
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
    const { userId, otp } = verifyOtpDto;

    // Find user
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if email already verified
    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Check if OTP exists
    if (!user.emailVerification?.otpHash) {
      throw new BadRequestException('No OTP found. Please request a new one.');
    }

    // Check if OTP expired
    if (new Date() > user.emailVerification.expiresAt) {
      throw new BadRequestException('OTP has expired');
    }

    // Verify OTP
    const otpMatch = await bcrypt.compare(otp, user.emailVerification.otpHash);
    if (!otpMatch) {
      throw new BadRequestException('Invalid OTP');
    }

    // Mark email as verified
    await this.usersService.verifyEmail(userId);

    return { message: 'Email verified successfully' };
  }

  /**
   * Resend OTP with rate limiting
   */
  async resendOtp(resendOtpDto: ResendOtpDto): Promise<{ message: string }> {
    const { email } = resendOtpDto;

    // Find user
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists
      return { message: 'If email exists, OTP has been sent' };
    }

    // Check if email already verified
    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Rate limiting: check if user can resend OTP
    const lastResendTime = this.otpResendAttempts.get(email);
    if (
      lastResendTime &&
      Date.now() - lastResendTime < this.otpResendCooldownMinutes * 60 * 1000
    ) {
      throw new BadRequestException(
        `Please wait ${this.otpResendCooldownMinutes} minute(s) before requesting a new OTP`,
      );
    }

    // Generate and send OTP
    await this.generateAndSendOtp(user);
    this.otpResendAttempts.set(email, Date.now());

    return { message: 'OTP has been sent to your email' };
  }

  /**
   * Refresh access token using refresh token (with token rotation)
   */
  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verify refresh token
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Find user
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Verify refresh token hash
      if (!user.refreshTokenHash) {
        throw new UnauthorizedException('Refresh token not found');
      }

      const refreshTokenMatch = await bcrypt.compare(
        refreshToken,
        user.refreshTokenHash,
      );
      if (!refreshTokenMatch) {
        // Potential token reuse — invalidate all tokens
        await this.usersService.updateRefreshTokenHash(
          user._id.toString(),
          null,
        );
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new token pair (rotation)
      const tokens = await this.generateTokens(
        user._id.toString(),
        user.email,
        user.roles,
      );

      // Store new refresh token hash
      await this.usersService.updateRefreshTokenHash(
        user._id.toString(),
        tokens.refreshTokenHash,
      );

      await this.auditService.log({
        userId: user._id.toString(),
        action: AuditAction.TOKEN_REFRESHED,
      });

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      this.logger.error('Token refresh failed:', error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Logout user by clearing refresh token
   */
  async logout(userId: string): Promise<{ message: string }> {
    await this.usersService.updateRefreshTokenHash(userId, null);
    await this.auditService.log({
      userId,
      action: AuditAction.LOGOUT,
    });
    return { message: 'Logged out successfully' };
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(userId: string): Promise<User> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  /**
   * Private method to generate and send OTP
   */
  private async generateAndSendOtp(user: User): Promise<void> {
    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Hash OTP
    const otpHash = await bcrypt.hash(otp, this.saltRounds);

    // Calculate expiration time
    const expiresAt = new Date(
      Date.now() + this.otpExpirationMinutes * 60 * 1000,
    );

    // Store hashed OTP
    await this.usersService.updateEmailVerificationOtp(
      user._id.toString(),
      otpHash,
      expiresAt,
    );

    // Send OTP via email
    try {
      const sent = await this.mailService.sendVerificationEmail(user.email, otp);
      if (sent) {
        this.logger.log(`OTP sent to ${user.email}`);
      } else {
        this.logger.warn(
          `OTP generated for ${user.email} but email not delivered (SMTP not configured). Check server logs for the OTP.`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${user.email}:`, error);
      throw new BadRequestException('Failed to send verification email');
    }
  }

  /**
   * Private method to generate access and refresh tokens
   */
  private async generateTokens(
    userId: string,
    email: string,
    roles: UserRole[],
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    refreshTokenHash: string;
  }> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
      roles,
    };

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    const accessToken: string = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_ACCESS_EXPIRES_IN',
        '15m',
      ) as any,
    });

    const refreshToken: string = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_EXPIRES_IN',
        '7d',
      ) as any,
    });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */

    // Hash refresh token for storage
    const refreshTokenHash = await bcrypt.hash(refreshToken, this.saltRounds);

    return {
      accessToken,
      refreshToken,
      refreshTokenHash,
    };
  }
}
