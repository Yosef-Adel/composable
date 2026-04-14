import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(
    name: string,
    email: string,
    hashedPassword: string,
  ): Promise<User> {
    const user = new this.userModel({
      name,
      email,
      password: hashedPassword,
      roles: [UserRole.USER],
      isEmailVerified: false,
    });
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      email: email.toLowerCase(),
      deletedAt: null,
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findOne({ _id: id, deletedAt: null });
  }

  async updateEmailVerificationOtp(
    userId: string,
    otpHash: string,
    expiresAt: Date,
  ): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        emailVerification: {
          otpHash,
          expiresAt,
        },
      },
      { new: true },
    );
  }

  async verifyEmail(userId: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        isEmailVerified: true,
        emailVerification: null,
      },
      { new: true },
    );
  }

  async updateRefreshTokenHash(
    userId: string,
    refreshTokenHash: string | null,
  ): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { refreshTokenHash },
      { new: true },
    );
  }

  async getAllUsers(
    page = 1,
    limit = 20,
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const [data, total] = await Promise.all([
      this.userModel
        .find({ deletedAt: null })
        .select('-password -refreshTokenHash')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.userModel.countDocuments({ deletedAt: null }).exec(),
    ]);
    return { data: data as User[], total, page, limit };
  }

  async getUserCount(): Promise<number> {
    return this.userModel.countDocuments({ deletedAt: null });
  }

  async softDelete(userId: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { deletedAt: new Date(), refreshTokenHash: null },
      { new: true },
    );
  }
}
