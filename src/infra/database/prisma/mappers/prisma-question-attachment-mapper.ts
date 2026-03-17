import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import { QuestionAttachment } from '../../../../domain/forum/enterprise/entities/question-attachment';
import { QuestionAttachment as PrismaQuestionAttachment } from '@prisma/client';

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaQuestionAttachment): QuestionAttachment {
    return QuestionAttachment.create(
      {
        questionId: new UniqueEntityID(raw.questionId),
        attachmentId: new UniqueEntityID(raw.attachmentId),
      },
      new UniqueEntityID(raw.id),
    );
  }
}
