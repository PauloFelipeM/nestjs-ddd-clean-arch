import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '../env';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CreateAccountController } from './http/controllers/create-account.controller';
import { AuthenticateController } from './http/controllers/authenticate.controller';
import { CreateQuestionController } from './http/controllers/create-question.controller';
import { FetchRecentQuestionsController } from './http/controllers/fetch-recent-questions.controller';
import { CreateQuestionUseCase } from '../domain/forum/application/use-cases/create-question';
import { FetchRecentQuestionsUseCase } from '../domain/forum/application/use-cases/fetch-recent-questions';
import { EnvService } from './env.service';
import { UploadAttachmentController } from './http/controllers/upload-attachment.controller';
import { StorageModule } from './storage/storage.module';
import { EventsModule } from './events/events.module';
import { UploadAndCreateAttachmentUseCase } from '../domain/forum/application/use-cases/upload-and-create-attachment';
import { ReadNotificationController } from './http/controllers/read-notification.controller';
import { ReadNotificationUseCase } from '../domain/notification/application/use-cases/read-notification';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
    StorageModule,
    EventsModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    UploadAttachmentController,
    ReadNotificationController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    UploadAndCreateAttachmentUseCase,
    ReadNotificationUseCase,
    EnvService,
  ],
})
export class AppModule {}
