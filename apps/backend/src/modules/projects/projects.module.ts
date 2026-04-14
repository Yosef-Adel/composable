import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './project.schema';
import {
  ProjectVersion,
  ProjectVersionSchema,
} from './project-version.schema';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { SharedController } from './shared.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: ProjectVersion.name, schema: ProjectVersionSchema },
    ]),
  ],
  controllers: [ProjectsController, SharedController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
