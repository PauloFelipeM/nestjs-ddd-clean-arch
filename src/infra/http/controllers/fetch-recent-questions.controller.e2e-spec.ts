import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/infra/app.module';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { PrismaService } from '../../database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('FetchRecentQuestionsController (e2e)', () => {
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

  test('GET /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'oHt3B@example.com',
        password: '123456',
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    await prisma.question.createMany({
      data: [
        {
          slug: 'question-1',
          title: 'Question 1',
          content: 'Question 1 content',
          authorId: user.id,
        },
        {
          slug: 'question-2',
          title: 'Question 2',
          content: 'Question 2 content',
          authorId: user.id,
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toEqual([
      {
        questions: [
          expect.objectContaining({
            title: 'Question 1',
          }),
          expect.objectContaining({
            title: 'Question 2',
          }),
        ],
      },
    ]);
  });
});
