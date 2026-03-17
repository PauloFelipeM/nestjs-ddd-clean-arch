import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/infra/app.module';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { PrismaService } from '../../database/prisma/prisma.service';

describe('AuthenticateController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('POST /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'oHt3B@example.com',
        password: '123456',
      },
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'oHt3B@example.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
