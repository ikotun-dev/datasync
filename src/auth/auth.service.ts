import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
@Injectable()
export class AuthService {
  constructor(@Inject('FIREBASE_APP') private firebaseApp: admin.app.App) {}

  //This verifies the token sen
  async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    try {
      return await this.firebaseApp.auth().verifyIdToken(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

}
