import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/infra/app.module';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { PrismaService } from '../../database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('CreateQuestionController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('POST /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'oHt3B@example.com',
        password: '123456',
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New question',
        content: 'New question content',
      });

    expect(response.statusCode).toBe(201);

    const question = await prisma.question.findFirst({
      where: {
        title: 'New question',
      },
    });

    expect(question).toBeTruthy();
  });
});
