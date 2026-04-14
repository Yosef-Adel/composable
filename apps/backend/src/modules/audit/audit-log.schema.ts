import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum AuditAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  TOKEN_REFRESHED = 'TOKEN_REFRESHED',
  ACCOUNT_DELETED = 'ACCOUNT_DELETED',
  ADMIN_LIST_USERS = 'ADMIN_LIST_USERS',
}

@Schema({ timestamps: true })
export class AuditLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: AuditAction, index: true })
  action: AuditAction;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop()
  ip?: string;

  @Prop()
  userAgent?: string;

  createdAt: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
