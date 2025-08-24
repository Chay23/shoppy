import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getCurrentUserByContext } from 'src/common/utils/user.utils';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
