import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateQuestionDTO } from './dto/questions.dto';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post('create')
  @Auth()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createQuestionDTO: CreateQuestionDTO,
    @CurrentUser('id') userId: string,
  ) {
    return await this.questionsService.createQuestion({
      ...createQuestionDTO,
      userId,
    });
  }

  @Get()
  async findAll() {
    return this.questionsService.getQuestions();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.questionsService.getQuestion(id);
  }
}
