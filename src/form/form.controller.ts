import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase-auth.guard';
import { FormService } from './form.service';
import { SubmitFormDto } from './dto/submit-form.dto';
import { User, UserRole } from 'src/user/entities/user.entity';

@UseGuards(FirebaseAuthGuard) //All routes here require authentication
@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  // ─────────────────────────────────────────────────────────────────
  // USER A — Endpoints
  // ─────────────────────────────────────────────────────────────────

  /**
   * User A submits company data here.
   */
  @Post('company-details')
  submitForm(@Req() req: Request & { user: User }, @Body() dto: SubmitFormDto) {
    if (req.user.role !== UserRole.USER_A) {
      throw new ForbiddenException('Only User A can submit forms');
    }
    return this.formService.submitForm(req.user, dto);
  }

  /**
   * GET /form/my-submissions
   */
  @Get('my-submissions')
  getMySubmissions(@Req() req: Request & { user: User }) {
    if (req.user.role !== UserRole.USER_A) {
      throw new ForbiddenException('Only User A can view submissions');
    }
    return this.formService.getMySubmissions(req.user);
  }

  /**
   * GET /form/my-uploads
   * User A views all files User B has uploaded to their account.
   */
  @Get('my-uploads')
  getMyUploads(@Req() req: Request & { user: User }) {
    if (req.user.role !== UserRole.USER_A) {
      throw new ForbiddenException('Only User A can view their uploads');
    }
    return this.formService.getUploadsForUser(req.user.id);
  }

  // ─────────────────────────────────────────────────────────────────
  // USER B — Endpoints
  // ─────────────────────────────────────────────────────────────────

  /**
   * GET /form/latest/:userAId
   * User B views the most recent submission made by User A.
   * :userAId is User A's ID.
   */
  @Get('latest/:userAId')
  getLatestSubmission(@Req() req: Request & { user: User }, @Param('userAId') userAId: string) {
    if (req.user.role !== UserRole.USER_B) {
      throw new ForbiddenException('Only User B can view another user\'s submissions');
    }
    return this.formService.getLatestSubmission(userAId);
  }

  /**
   * POST /form/upload/:userAId
   * User B uploads an image to User A's account.
   * :userAId is User A's ID.
   */
  @Post('upload/:userAId')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only images are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    }),
  )
  async uploadFile(
    @Req() req: Request & { user: User },
    @Param('userAId') userAId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.user.role !== UserRole.USER_B) {
      throw new ForbiddenException('Only User B can upload files');
    }
    const userA = { id: userAId } as User;
    return this.formService.uploadToUserA(userA, file);
  }
}
