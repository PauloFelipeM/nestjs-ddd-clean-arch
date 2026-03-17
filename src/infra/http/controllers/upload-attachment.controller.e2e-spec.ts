import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/infra/app.module';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('UploadAttachmentController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  test('POST /attachments', async () => {
    const response = await request(app.getHttpServer())
      .post('/attachments')
      .attach('file', './test/e2e/resources/avatar.png');

    expect(response.statusCode).toBe(201);
  });
});
