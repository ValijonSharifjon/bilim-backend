import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post('/create')
  @Auth()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAnswerDto: CreateAnswerDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.answersService.createAnswer({
      ...createAnswerDto,
      userId,
    });
  }

  @Get()
  async findAll() {
    return this.answersService.getAnswers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.answersService.getAnswer(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ) {
    return this.answersService.update(+id, updateAnswerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.answersService.remove(+id);
  }
}
