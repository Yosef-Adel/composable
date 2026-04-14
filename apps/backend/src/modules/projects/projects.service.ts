import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { randomBytes } from 'crypto';
import { Project } from './project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto, SaveComposerDataDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  async create(ownerId: string, dto: CreateProjectDto): Promise<Project> {
    return this.projectModel.create({
      ownerId: new Types.ObjectId(ownerId),
      name: dto.name,
      description: dto.description ?? '',
    });
  }

  async findAllByOwner(
    ownerId: string,
    page = 1,
    limit = 20,
    search?: string,
    sort: string = '-updatedAt',
  ): Promise<{ data: Project[]; total: number; page: number; limit: number }> {
    const filter: any = {
      ownerId: new Types.ObjectId(ownerId),
      deletedAt: null,
    };

    if (search) {
      filter.$text = { $search: search };
    }

    const [data, total] = await Promise.all([
      this.projectModel
        .find(filter)
        .select('-composerData')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.projectModel.countDocuments(filter).exec(),
    ]);

    return { data: data as Project[], total, page, limit };
  }

  async findById(projectId: string, ownerId: string): Promise<Project> {
    const project = await this.projectModel
      .findOne({
        _id: new Types.ObjectId(projectId),
        ownerId: new Types.ObjectId(ownerId),
        deletedAt: null,
      })
      .lean()
      .exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const cd = (project as any).composerData;
    this.logger.log(
      `Loading project ${projectId}: ${cd?.nodes?.length ?? 0} nodes, ${cd?.edges?.length ?? 0} edges, ${Object.keys(cd?.nodeConfigs ?? {}).length} configs`,
    );
    if (cd?.nodes?.length > 0) {
      this.logger.log(`First loaded node: ${JSON.stringify(cd.nodes[0])}`);
    }

    return project as Project;
  }

  async update(
    projectId: string,
    ownerId: string,
    dto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.projectModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(projectId),
        ownerId: new Types.ObjectId(ownerId),
        deletedAt: null,
      },
      { $set: dto },
      { new: true },
    );

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async saveComposerData(
    projectId: string,
    ownerId: string,
    dto: SaveComposerDataDto,
  ): Promise<Project> {
    this.logger.log(
      `Saving composer data: ${dto.nodes?.length ?? 0} nodes, ${dto.edges?.length ?? 0} edges, ${Object.keys(dto.nodeConfigs ?? {}).length} configs`,
    );
    if (dto.nodes?.length > 0) {
      this.logger.log(`First node: ${JSON.stringify(dto.nodes[0])}`);
    }
    if (dto.edges?.length > 0) {
      this.logger.log(`First edge: ${JSON.stringify(dto.edges[0])}`);
    }
    const project = await this.projectModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(projectId),
        ownerId: new Types.ObjectId(ownerId),
        deletedAt: null,
      },
      {
        $set: {
          composerData: {
            nodes: dto.nodes,
            edges: dto.edges,
            nodeConfigs: dto.nodeConfigs,
          },
          nodeCount: dto.nodeCount ?? dto.nodes.length,
        },
      },
      { new: true },
    );

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async getComposerData(
    projectId: string,
    ownerId: string,
  ): Promise<{
    nodes: any[];
    edges: any[];
    nodeConfigs: Record<string, any>;
  }> {
    const project = await this.findById(projectId, ownerId);
    return (
      project.composerData ?? { nodes: [], edges: [], nodeConfigs: {} }
    );
  }

  async softDelete(projectId: string, ownerId: string): Promise<void> {
    const result = await this.projectModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(projectId),
        ownerId: new Types.ObjectId(ownerId),
        deletedAt: null,
      },
      { $set: { deletedAt: new Date() } },
    );

    if (!result) {
      throw new NotFoundException('Project not found');
    }
  }

  async shareProject(projectId: string, ownerId: string): Promise<{ shareToken: string }> {
    const project = await this.findById(projectId, ownerId);

    if ((project as any).shareToken) {
      return { shareToken: (project as any).shareToken };
    }

    const shareToken = randomBytes(16).toString('hex');
    await this.projectModel.findByIdAndUpdate(projectId, {
      $set: { isPublic: true, shareToken, sharedAt: new Date() },
    });

    return { shareToken };
  }

  async unshareProject(projectId: string, ownerId: string): Promise<void> {
    const result = await this.projectModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(projectId),
        ownerId: new Types.ObjectId(ownerId),
        deletedAt: null,
      },
      { $set: { isPublic: false, shareToken: null, sharedAt: null } },
    );

    if (!result) {
      throw new NotFoundException('Project not found');
    }
  }

  async findByShareToken(token: string): Promise<Project> {
    const project = await this.projectModel
      .findOne({ shareToken: token, isPublic: true, deletedAt: null })
      .lean()
      .exec();

    if (!project) {
      throw new NotFoundException('Shared project not found');
    }
    return project as Project;
  }
}
