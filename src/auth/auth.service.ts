import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  constructor(@Inject('FIREBASE_APP') private firebaseApp: admin.app.App) {}

  async verifyToken(
    token: string,
  ): Promise<{ uid: string; email: string }> {
    try {
      const decoded = await this.firebaseApp.auth().verifyIdToken(token);
      return { uid: decoded.uid, email: decoded.email ?? '' };
    } catch (primaryError) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
