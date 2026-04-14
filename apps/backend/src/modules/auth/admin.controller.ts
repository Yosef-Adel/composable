import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import {
  UserProfileResponseDto,
  AdminStatsResponseDto,
} from './dto/responses.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of users',
    type: [UserProfileResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getAllUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const clampedLimit = Math.min(Math.max(limit, 1), 100);
    const clampedPage = Math.max(page, 1);
    const result = await this.usersService.getAllUsers(clampedPage, clampedLimit);
    return {
      users: result.data.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        roles: user.roles,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get system statistics (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'System statistics',
    type: AdminStatsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getStats() {
    const userCount = await this.usersService.getUserCount();
    return { totalUsers: userCount };
  }
}
