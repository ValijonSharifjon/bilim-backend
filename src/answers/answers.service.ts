import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  CreateAnswerDto,
  CreateAnswerServerDto,
} from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnswersService {
  constructor(private prisma: PrismaService) {}
  async createAnswer(createAnswerDto: CreateAnswerServerDto) {
    try {
      const { userId, content, questionId } = createAnswerDto;

      return await this.prisma.answer.create({
        data: {
          authorId: userId,
          content: content,
          questionId: questionId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAnswers() {
    try {
      return this.prisma.answer.findMany({
        where: {
          status: 'CHECKED',
        },
        include: {
          question: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAnswer(id: string) {
    try {
      return this.prisma.answer.findUnique({
        where: {
          id,
        },
        include: {
          question: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  update(id: number, updateAnswerDto: UpdateAnswerDto) {
    return `This action updates a #${id} answer`;
  }

  remove(id: number) {
    return `This action removes a #${id} answer`;
  }
}
