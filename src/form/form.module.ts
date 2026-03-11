import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { Company } from './entities/company.entity';
import { Upload } from './entities/upload.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Upload]), AuthModule, UserModule, ConfigModule],
  controllers: [FormController],
  providers: [FormService, CloudinaryProvider],
})
export class FormModule {}
