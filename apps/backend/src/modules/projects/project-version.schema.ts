import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ProjectVersion extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true, index: true })
  projectId: Types.ObjectId;

  @Prop({ required: true })
  version: number;

  @Prop()
  message: string;

  @Prop({ type: Object, required: true })
  composerData: Record<string, any>;

  @Prop({ type: String, default: 'manual' })
  source: string; // 'manual' | 'auto'
}

export const ProjectVersionSchema =
  SchemaFactory.createForClass(ProjectVersion);
