import { Injectable } from '@nestjs/common';
import { AttachmentsRepository } from '../../../../domain/forum/application/repositories/attachments-repository';
import { Attachment } from '../../../../domain/forum/enterprise/entities/attachment';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAttachmentsRepository extends AttachmentsRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(attachment: Attachment): Promise<void> {
    await this.prisma.attachment.create({
      data: {
        id: attachment.id.toString(),
        title: attachment.title,
        link: attachment.link,
      },
    });
  }
}
