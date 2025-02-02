import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDTO {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateQuestionServiceDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
