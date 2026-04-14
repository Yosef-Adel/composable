import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto, SaveComposerDataDto } from './dto/update-project.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new project' })
  async create(@Request() req: any, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(req.user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all projects for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  async findAll(
    @Request() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    return this.projectsService.findAllByOwner(
      req.user.sub,
      Math.max(page, 1),
      Math.min(Math.max(limit, 1), 100),
      search,
      sort,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.projectsService.findById(id, req.user.sub);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a project' })
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a project' })
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.projectsService.softDelete(id, req.user.sub);
  }

  @Get(':id/composer')
  @ApiOperation({ summary: 'Get composer data for a project' })
  async getComposerData(
    @Request() req: any,
    @Param('id') id: string,
  ) {
    return this.projectsService.getComposerData(id, req.user.sub);
  }

  @Put(':id/composer')
  @ApiOperation({ summary: 'Save composer data for a project' })
  async saveComposerData(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: SaveComposerDataDto,
  ) {
    return this.projectsService.saveComposerData(id, req.user.sub, dto);
  }

  @Post(':id/share')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate a share link for a project' })
  async share(@Request() req: any, @Param('id') id: string) {
    return this.projectsService.shareProject(id, req.user.sub);
  }

  @Delete(':id/share')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke share link for a project' })
  async unshare(@Request() req: any, @Param('id') id: string) {
    await this.projectsService.unshareProject(id, req.user.sub);
  }
}
