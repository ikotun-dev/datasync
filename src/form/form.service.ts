import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';
import { Company } from './entities/company.entity';
import { Upload } from './entities/upload.entity';
import { SubmitFormDto } from './dto/submit-form.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,

    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,
  ) {}

  /**
   * User A submits company data.
   * Percentage is auto-calculated as (noOfUsers / noOfProducts) * 100,
   */
  async submitForm(user: User, dto: SubmitFormDto): Promise<Company> {
    try {
      const percentage = parseFloat(
        ((dto.noOfUsers / dto.noOfProducts) * 100).toFixed(2),
      );

      const company = this.companyRepository.create({
        name: dto.name,
        noOfUsers: dto.noOfUsers,
        noOfProducts: dto.noOfProducts,
        percentage,
        user,
      });

      return await this.companyRepository.save(company);
    } catch (error) {
      throw new InternalServerErrorException('Failed to submit form data');
    }
  }

  /**
   * Returns all form submissions made by User A.
   */
  async getMySubmissions(user: User): Promise<Company[]> {
    try {
      return await this.companyRepository.find({
        where: { user: { id: user.id } },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve submissions');
    }
  }

  /**
   * User B views the most recent form submission made by User A.
   * userAId is the Postgres UUID of User A's account.
   */
  async getLatestSubmission(userAId: string): Promise<Company> {
    try {
      const latest = await this.companyRepository.findOne({
        where: { user: { id: userAId } },
        order: { createdAt: 'DESC' },
        relations: ['user'],
      });

      if (!latest) {
        throw new NotFoundException('No submissions found for this user');
      }

      return latest;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to retrieve latest submission');
    }
  }

  /**
   * User B uploads an image to User A's account.
   * The file buffer is uploaded to Cloudinary, and the returned URL is stored in the DB.
   */
  async uploadToUserA(
    userA: User,
    file: Express.Multer.File,
  ): Promise<Upload> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    try {
      // Upload to Cloudinary
      const result = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'datasync' },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve(result);
            },
          );
          uploadStream.end(file.buffer);
        },
      );

      const upload = this.uploadRepository.create({
        fileUrl: result.secure_url,
        fileName: file.originalname,
        user: userA,
      });

      return await this.uploadRepository.save(upload);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Returns all uploads attached to User A's account.
   * User A can view files that User B has uploaded for them.
   */
  async getUploadsForUser(userId: string): Promise<Upload[]> {
    try {
      return await this.uploadRepository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to retrieve uploads: ${error.message}`);
    }
  }
}
