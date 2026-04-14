import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: Object, default: { nodes: [], edges: [], nodeConfigs: {} } })
  composerData: {
    nodes: any[];
    edges: any[];
    nodeConfigs: Record<string, any>;
  };

  @Prop({ default: 0 })
  nodeCount: number;

  @Prop({ default: null })
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({ ownerId: 1, deletedAt: 1 });
ProjectSchema.index({ name: 'text', description: 'text' });
