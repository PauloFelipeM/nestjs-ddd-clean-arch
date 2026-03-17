import { Injectable } from '@nestjs/common';
import { QuestionAttachmentsRepository } from '../../../../domain/forum/application/repositories/question-attachments-repository';
import { QuestionAttachment } from '../../../../domain/forum/enterprise/entities/question-attachment';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper';

@Injectable()
export class PrismaQuestionAttachmentsRepository extends QuestionAttachmentsRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = await this.prisma.questionAttachment.findMany({
      where: { questionId },
    });

    return questionAttachments.map(PrismaQuestionAttachmentMapper.toDomain);
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.questionAttachment.deleteMany({
      where: { questionId },
    });
  }
}
