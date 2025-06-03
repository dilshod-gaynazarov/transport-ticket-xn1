import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AdminRoles } from 'src/enums';
import { handleError } from 'src/helpers/error-handle';

@Injectable()
export class SelfGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const { user, params } = context.switchToHttp().getRequest();
      if (user.role === AdminRoles.SUPERADMIN || params.id == user.id) {
        return true;
      }
      throw new ForbiddenException('Forbidden user');
    } catch (error) {
      return handleError(error);
    }
  }
}
