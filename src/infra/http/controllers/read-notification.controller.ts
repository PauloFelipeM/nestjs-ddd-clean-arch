import {
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../auth/current-user.decorator';
import type { Token } from '../../auth/jwt.strategy';
import { ReadNotificationUseCase } from '../../../domain/notification/application/use-cases/read-notification';
import { ResourceNotFoundError } from '../../../core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '../../../core/errors/errors/not-allowed-error';

@Controller('notifications/:notificationId/read')
@UseGuards(AuthGuard('jwt'))
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('notificationId') notificationId: string,
    @CurrentUser() user: Token,
  ) {
    const result = await this.readNotification.execute({
      notificationId,
      recipientId: user.sub,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new ForbiddenException(error.message);
      }
    }
  }
}
