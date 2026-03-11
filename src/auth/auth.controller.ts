import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';

@Controller('auth')
export class AuthController {
  @Get('profile')
  @UseGuards(FirebaseAuthGuard)
  //validate the user's account
  getProfile(@Req() req: Request & { user: any }) {
    return req.user;
  }
}
