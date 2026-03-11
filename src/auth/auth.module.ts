import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { UserModule } from 'src/user/user.module';
import { firebaseProvider } from './firebase.provider';

@Module({
  imports: [ConfigModule, UserModule],
  controllers: [AuthController],
  providers: [firebaseProvider, AuthService, FirebaseAuthGuard],
  exports: [AuthService, FirebaseAuthGuard],
})
export class AuthModule {}
