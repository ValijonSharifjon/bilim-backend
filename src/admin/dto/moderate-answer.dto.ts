import { IsEnum } from 'class-validator';
import { AnswerStatus } from '@prisma/client';

export class ModerateAnswerDto {
  @IsEnum(AnswerStatus)
  status: AnswerStatus;
}
