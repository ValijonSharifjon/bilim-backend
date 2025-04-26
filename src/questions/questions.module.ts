import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService, PrismaService],
  imports: [PrismaModule],
})
export class QuestionsModule {}
