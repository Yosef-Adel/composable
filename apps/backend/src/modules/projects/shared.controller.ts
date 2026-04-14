import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';

@ApiTags('Shared')
@Controller('shared')
export class SharedController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get(':token')
  @ApiOperation({ summary: 'Get a publicly shared project (no auth required)' })
  async getShared(@Param('token') token: string) {
    return this.projectsService.findByShareToken(token);
  }
}
