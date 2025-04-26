import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { PrismaService } from '../prisma/prisma.service';
const mockPrisma = {
  question: {
    create: jest.fn(),
  },
};
describe('QuestionService', () => {
  let service: QuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
  });

  describe('createQuestion()', () => {
    it('should create a new question', async () => {
      const dto = {
        userId: '53061930-6f81-4b52-abb8-4b664da4548b',
        content: 'new content',
      };
      mockPrisma.question.create.mockResolvedValue({
        id: '1',
        content: dto.content,
        authorId: dto.userId,
        status: 'CREATED',
        createdAt: '2025-04-26T18:30:16.102Z',
        updatedAt: '2025-04-26T18:30:16.102Z',
      });

      const result = await service.createQuestion(dto);

      expect(result).toEqual({
        id: '1',
        content: dto.content,
        authorId: dto.userId,
        status: 'CREATED',
        createdAt: '2025-04-26T18:30:16.102Z',
        updatedAt: '2025-04-26T18:30:16.102Z',
      });
    });
  });
});
