import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { UserModule } from 'src/user/user.module';

// This provider will initialize the Firebase Admin SDK and make it available for injection
const firebaseProvider = {
  provide: 'FIREBASE_APP', 
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
        clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        privateKey: configService
          .get<string>('FIREBASE_PRIVATE_KEY')
          ?.replace(/\\n/g, '\n'), //Added this cos env would escape newlines in the priv key. 
      }),
    });
  },
};


@Module({
  imports: [ConfigModule, UserModule],
  controllers: [AuthController],
  providers: [firebaseProvider, AuthService, FirebaseAuthGuard],
  exports: [AuthService, FirebaseAuthGuard], 
})
export class AuthModule {}
