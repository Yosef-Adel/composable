import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: [String],
    enum: Object.values(UserRole),
    default: [UserRole.USER],
  })
  roles: UserRole[];

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({
    type: {
      otpHash: String,
      expiresAt: Date,
    },
    default: null,
  })
  emailVerification: {
    otpHash: string;
    expiresAt: Date;
  };

  @Prop({ default: null })
  refreshTokenHash?: string;

  @Prop({ default: null })
  deletedAt?: Date;

  // Managed by Mongoose timestamps: true
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ 'emailVerification.expiresAt': 1 }, { sparse: true });
UserSchema.index({ isEmailVerified: 1 });
UserSchema.index({ roles: 1 });
UserSchema.index({ createdAt: 1 });
UserSchema.index({ deletedAt: 1 }, { sparse: true });
