import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Token } from './jwt.strategy';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as Token;
  },
);
