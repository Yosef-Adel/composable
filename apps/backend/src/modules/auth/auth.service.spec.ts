import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { AuditService } from '../audit/audit.service';
import { UserRole } from '../users/user.schema';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;
  let mailService: Partial<MailService>;
  let auditService: Partial<AuditService>;
  let configService: Partial<ConfigService>;

  const mockUser = {
    _id: { toString: () => 'user-123' },
    name: 'Test User',
    email: 'test@example.com',
    password: '', // Will be set in beforeEach
    roles: [UserRole.USER],
    isEmailVerified: true,
    refreshTokenHash: null,
    emailVerification: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockUser.password = await bcrypt.hash('ValidPass123!', 10);

    usersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateRefreshTokenHash: jest.fn(),
      updateEmailVerificationOtp: jest.fn(),
      verifyEmail: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock-token'),
      verify: jest.fn(),
    };

    mailService = {
      sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    };

    auditService = {
      log: jest.fn().mockResolvedValue(undefined),
    };

    configService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          JWT_ACCESS_SECRET: 'access-secret',
          JWT_REFRESH_SECRET: 'refresh-secret',
          JWT_ACCESS_EXPIRES_IN: '15m',
          JWT_REFRESH_EXPIRES_IN: '7d',
        };
        return config[key] ?? undefined;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: MailService, useValue: mailService },
        { provide: AuditService, useValue: auditService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.create as jest.Mock).mockResolvedValue(mockUser);
      (usersService.updateEmailVerificationOtp as jest.Mock).mockResolvedValue(
        mockUser,
      );

      const result = await service.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'ValidPass123!',
      });

      expect(result.userId).toBe('user-123');
      expect(result.message).toContain('registered successfully');
      expect(usersService.create).toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).toHaveBeenCalled();
    });

    it('should throw ConflictException if user already exists', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        service.register({
          name: 'Test',
          email: 'test@example.com',
          password: 'ValidPass123!',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return tokens and user on valid credentials', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (usersService.updateRefreshTokenHash as jest.Mock).mockResolvedValue(
        mockUser,
      );

      const result = await service.login({
        email: 'test@example.com',
        password: 'ValidPass123!',
      });

      expect(result.accessToken).toBe('mock-token');
      expect(result.refreshToken).toBe('mock-token');
      expect(result.user.email).toBe('test@example.com');
      expect(auditService.log).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        service.login({
          email: 'noone@example.com',
          password: 'any-pass',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException if email not verified', async () => {
      const unverifiedUser = { ...mockUser, isEmailVerified: false };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(unverifiedUser);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'ValidPass123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('logout', () => {
    it('should clear refresh token and log audit', async () => {
      (usersService.updateRefreshTokenHash as jest.Mock).mockResolvedValue(
        mockUser,
      );

      const result = await service.logout('user-123');

      expect(result.message).toBe('Logged out successfully');
      expect(usersService.updateRefreshTokenHash).toHaveBeenCalledWith(
        'user-123',
        null,
      );
      expect(auditService.log).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should return new token pair on valid refresh', async () => {
      const hashedToken = await bcrypt.hash('mock-token', 10);
      const userWithRefresh = { ...mockUser, refreshTokenHash: hashedToken };

      (jwtService.verify as jest.Mock).mockReturnValue({
        sub: 'user-123',
        email: 'test@example.com',
        roles: [UserRole.USER],
      });
      (usersService.findById as jest.Mock).mockResolvedValue(userWithRefresh);
      (usersService.updateRefreshTokenHash as jest.Mock).mockResolvedValue(
        userWithRefresh,
      );

      const result = await service.refreshToken({
        refreshToken: 'mock-token',
      });

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(auditService.log).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException on invalid refresh token', async () => {
      (jwtService.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        service.refreshToken({ refreshToken: 'invalid' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getCurrentUser', () => {
    it('should return user if found', async () => {
      (usersService.findById as jest.Mock).mockResolvedValue(mockUser);

      const user = await service.getCurrentUser('user-123');
      expect(user.email).toBe('test@example.com');
    });

    it('should throw BadRequestException if user not found', async () => {
      (usersService.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.getCurrentUser('nonexistent')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
