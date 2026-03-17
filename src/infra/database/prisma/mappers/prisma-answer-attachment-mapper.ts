import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import { AnswerAttachment } from '../../../../domain/forum/enterprise/entities/answer-attachment';
import { AnswerAttachment as PrismaAnswerAttachment } from '@prisma/client';

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAnswerAttachment): AnswerAttachment {
    return AnswerAttachment.create(
      {
        answerId: new UniqueEntityID(raw.answerId),
        attachmentId: new UniqueEntityID(raw.attachmentId),
      },
      new UniqueEntityID(raw.id),
    );
  }
}
