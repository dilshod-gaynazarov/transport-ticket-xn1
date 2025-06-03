import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { handleError } from 'src/helpers/error-handle';

export const GetCookie = createParamDecorator(
  async (key: string, context: ExecutionContext): Promise<string> => {
    try {
      const req = context.switchToHttp().getRequest();
      const refreshToken = req.cookies[key];
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token expired');
      }
      return refreshToken;
    } catch (error) {
      return handleError(error);
    }
  },
);
