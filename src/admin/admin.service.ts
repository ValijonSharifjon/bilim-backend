import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnswerStatus, UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async updateRole(userId: string, newRole: UserRole) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const superuser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return {
      id: superuser.id,
      email: superuser.email,
      role: superuser.role,
    };
  }

  async createAdmin(
    requesterId: string,
    targetUserId: string,
    newRole: UserRole,
  ) {
    const requester = await this.prisma.user.findUnique({
      where: { id: requesterId },
    });

    if (!requester) {
      throw new NotFoundException('Requesting user not found');
    }

    if (requester.role !== 'SUPERUSER') {
      throw new ForbiddenException('Only SUPERUSER can assign roles');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    const admin = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });

    return {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };
  }

  async getPendingAnswers() {
    try {
      return await this.prisma.answer.findMany({
        where: {
          status: 'CREATED',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async moderateAnswer(answerId: string, status: AnswerStatus) {
    try {
      const answer = await this.prisma.answer.findUnique({
        where: { id: answerId },
      });

      if (!answer) {
        throw new NotFoundException('Answer not found');
      }

      return this.prisma.answer.update({
        where: { id: answerId },
        data: { status },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
