import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const ModuleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = ModuleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  const userDto = {
    email: faker.internet.email(),
    password: '12345678',
  };

  it('/auth/register (POST) — success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(userDto)
      .expect(201);

    expect(res.body.user.email).toBe(userDto.email);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it('/auth.login (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userDto)
      .expect(200);

    expect(res.body.user.email).toBe(userDto.email);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it('/auth/login (POST) — wrong password', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...userDto, password: 'wrongpass' })
      .expect(401);
    expect(res.body.error).toBe('Unauthorized');
  });
});
