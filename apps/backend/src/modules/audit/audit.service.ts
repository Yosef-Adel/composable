import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog, AuditAction } from './audit-log.schema';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog.name) private auditModel: Model<AuditLog>,
  ) {}

  async log(params: {
    userId: string | Types.ObjectId;
    action: AuditAction;
    ip?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    await this.auditModel.create({
      userId:
        typeof params.userId === 'string'
          ? new Types.ObjectId(params.userId)
          : params.userId,
      action: params.action,
      ip: params.ip,
      userAgent: params.userAgent,
      metadata: params.metadata,
    });
  }

  async findByUser(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ data: AuditLog[]; total: number }> {
    const [data, total] = await Promise.all([
      this.auditModel
        .find({ userId: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.auditModel
        .countDocuments({ userId: new Types.ObjectId(userId) })
        .exec(),
    ]);
    return { data: data as AuditLog[], total };
  }
}
