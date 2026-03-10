import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}
