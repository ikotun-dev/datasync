import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature(
   [Company, File]
  )],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
