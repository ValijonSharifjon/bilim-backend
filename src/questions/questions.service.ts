import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionServiceDTO } from './dto/questions.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async createQuestion(createQuestionDTO: CreateQuestionServiceDTO) {
    const { userId, content } = createQuestionDTO;

    try {
      return await this.prisma.question.create({
        data: {
          authorId: userId,
          content,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getQuestions() {
    try {
      return await this.prisma.question.findMany({
        where: {
          status: 'CREATED',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getQuestion(id: any) {
    try {
      return await this.prisma.question.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
