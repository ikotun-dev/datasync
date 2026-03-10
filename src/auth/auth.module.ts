import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

// A custom provider is just an object that tells NestJS:
// "here's a token (FIREBASE_APP), here's how to create it"
const firebaseProvider = {
  provide: 'FIREBASE_APP', // the injection token - like a key in NestJS's DI container
  inject: [ConfigService],  // NestJS will pass ConfigService into the factory below
  useFactory: (configService: ConfigService) => {
    // useFactory means: run this function to produce the value for this provider
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
        clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        // Firebase stores the private key with literal \n in the env string.
        // .replace() converts those into real newline characters.
        privateKey: configService
          .get<string>('FIREBASE_PRIVATE_KEY')
          ?.replace(/\\n/g, '\n'),
      }),
    });
  },
};

@Module({
  imports: [ConfigModule], // needed so ConfigService is available to inject above
  controllers: [AuthController],
  providers: [firebaseProvider, AuthService], // register both so NestJS knows about them
  exports: [AuthService], // export AuthService so other modules (e.g. guards) can use it
})
export class AuthModule {}
