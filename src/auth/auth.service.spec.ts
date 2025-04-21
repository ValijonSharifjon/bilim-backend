import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {BadRequestException, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn(),
  verifyAsync: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register()', () => {
    it('should register a new user', async () => {
      const dto = { email: 'test@example.com', password: '12345678' };
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: '1',
        email: dto.email,
        password: 'hashed',
      });

      mockJwtService.sign.mockResolvedValue('token');
      const result = await service.register(dto);

      expect(result.user).toEqual({ id: '1', email: dto.email });
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw if user already exists', async () => {
      const dto = { email: 'test@example.com', password: '123456' };
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: dto.email,
      });

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login()', () => {
    it('should login successfully', async () => {
      const dto = { email: 'test@gmail.com', password: '12345678' };
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@gmail.com',
        password: hashedPassword,
      });

      mockJwtService.sign.mockReturnValue('token');

      const result = await service.login(dto);

      expect(result.user).toEqual({ id: '1', email: dto.email });
    });

    it('should throw if credentials are invalid', async () => {
      const dto = { email: 'test@example.com', password: 'wrongpass' };
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
