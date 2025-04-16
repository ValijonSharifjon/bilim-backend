import { Controller, Body, Patch, Get, UseGuards, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateRoleDto } from './dto/update-admin.dto';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';
import { RolesGuard } from './entities/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { ModerateAnswerDto } from './dto/moderate-answer.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch('superuser')
  @Auth()
  async updateSuperUserRole(
    @CurrentUser('id') userId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.adminService.updateRole(userId, updateRoleDto.role);
  }

  @Patch('create')
  @Auth()
  async createAdminRole(
    @CurrentUser('id') userId: string,
    @Body() createAdminDto: CreateAdminDto,
  ) {
    return this.adminService.createAdmin(
      userId,
      createAdminDto.adminId,
      createAdminDto.role,
    );
  }

  @Get('answers/pending')
  @Auth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getPendingAnswers() {
    return this.adminService.getPendingAnswers();
  }

  @Patch('answers/:id')
  @Auth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async moderateAnswer(
    @Param('id') id: string,
    @Body() moderateAnswerDto: ModerateAnswerDto,
  ) {
    return this.adminService.moderateAnswer(id, moderateAnswerDto.status);
  }
}
