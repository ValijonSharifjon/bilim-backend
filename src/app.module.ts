import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, QuestionsModule, AnswersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
