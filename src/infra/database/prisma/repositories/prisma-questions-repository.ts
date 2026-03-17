import { Injectable } from '@nestjs/common';
import { PaginationParams } from '../../../../core/repositories/pagination-params';
import { DomainEvents } from '../../../../core/events/domain-events';
import { QuestionsRepository } from '../../../../domain/forum/application/repositories/questions-repository';
import { Question } from '../../../../domain/forum/enterprise/entities/question';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';
import { CacheRepository } from 'src/infra/cache/cache-repository';

@Injectable()
export class PrismaQuestionsRepository extends QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
  ) {
    super();
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const cachedQuestion = await this.cache.get(`question:${slug}:details`);

    if (cachedQuestion) {
      return JSON.parse(cachedQuestion);
    }

    const question = await this.prisma.question.findUnique({
      where: { slug },
    });

    if (!question) {
      return null;
    }

    const questionDetails = PrismaQuestionMapper.toDomain(question);

    await this.cache.set(
      `question:${question.id}:details`,
      JSON.stringify(question),
    );

    return questionDetails;
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questions.map(PrismaQuestionMapper.toDomain);
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prisma.question.create({ data });

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prisma.question.update({
      where: { id: data.id },
      data,
    });

    await this.cache.delete(`question:${data.id}:details`);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({
      where: { id: question.id.toString() },
    });
  }
}
