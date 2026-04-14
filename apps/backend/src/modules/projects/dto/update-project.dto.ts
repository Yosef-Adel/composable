import { IsString, IsOptional, MaxLength, IsObject, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}

export class SaveComposerDataDto {
  @ApiProperty({ description: 'ReactFlow nodes array' })
  @IsArray()
  nodes: any[];

  @ApiProperty({ description: 'ReactFlow edges array' })
  @IsArray()
  edges: any[];

  @ApiProperty({ description: 'Node configurations keyed by node ID' })
  @IsObject()
  nodeConfigs: Record<string, any>;

  @ApiProperty({ description: 'Number of nodes', required: false })
  @IsNumber()
  @IsOptional()
  nodeCount?: number;
}
