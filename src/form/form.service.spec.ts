import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { FormService } from './form.service';
import { Company } from './entities/company.entity';
import { Upload } from './entities/upload.entity';
import { User } from 'src/user/entities/user.entity';

const mockCompanyRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

const mockUploadRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

describe('FormService', () => {
  let service: FormService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormService,
        { provide: getRepositoryToken(Company), useValue: mockCompanyRepository },
        { provide: getRepositoryToken(Upload), useValue: mockUploadRepository },
      ],
    }).compile();

    service = module.get<FormService>(FormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─────────────────────────────────────────────────────────────────
  // USER A — submitForm
  // ─────────────────────────────────────────────────────────────────

  describe('submitForm', () => {
    const mockUser = { id: 'user-uuid' } as User;
    const dto = { name: 'Acme Corp', noOfUsers: 500, noOfProducts: 50 };

    it('should calculate percentage and save company', async () => {
      const savedCompany = { id: 'company-uuid', ...dto, percentage: 1000, user: mockUser };
      mockCompanyRepository.create.mockReturnValue(savedCompany);
      mockCompanyRepository.save.mockResolvedValue(savedCompany);

      const result = await service.submitForm(mockUser, dto);

      // Percentage = (500 / 50) * 100 = 1000
      expect(mockCompanyRepository.create).toHaveBeenCalledWith({
        name: 'Acme Corp',
        noOfUsers: 500,
        noOfProducts: 50,
        percentage: 1000,
        user: mockUser,
      });
      expect(result).toEqual(savedCompany);
    });

    it('should round percentage to 2 decimal places', async () => {
      const unevenDto = { name: 'Test', noOfUsers: 7, noOfProducts: 3 };
      mockCompanyRepository.create.mockReturnValue({});
      mockCompanyRepository.save.mockResolvedValue({});

      await service.submitForm(mockUser, unevenDto);

      expect(mockCompanyRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ percentage: 233.33 }),
      );
    });
  });

  // USER A — getMySubmissions
  describe('getMySubmissions', () => {
    it('should return submissions ordered by createdAt DESC', async () => {
      const mockUser = { id: 'user-uuid' } as User;
      const submissions = [{ id: '1' }, { id: '2' }];
      mockCompanyRepository.find.mockResolvedValue(submissions);

      const result = await service.getMySubmissions(mockUser);

      expect(mockCompanyRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 'user-uuid' } },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(submissions);
    });
  });

  // USER B — getLatestSubmission
  describe('getLatestSubmission', () => {
    it('should return the most recent submission for a user', async () => {
      const latest = { id: '1', name: 'Acme' };
      mockCompanyRepository.findOne.mockResolvedValue(latest);

      const result = await service.getLatestSubmission('user-a-uuid');

      expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: 'user-a-uuid' } },
        order: { createdAt: 'DESC' },
        relations: ['user'],
      });
      expect(result).toEqual(latest);
    });

    it('should throw NotFoundException if no submissions exist', async () => {
      mockCompanyRepository.findOne.mockResolvedValue(null);

      await expect(service.getLatestSubmission('user-a-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // USER B — getUploadsForUser
  describe('getUploadsForUser', () => {
    it('should return uploads for a user', async () => {
      const uploads = [{ id: '1', fileUrl: 'https://example.com/img.png' }];
      mockUploadRepository.find.mockResolvedValue(uploads);

      const result = await service.getUploadsForUser('user-uuid');

      expect(mockUploadRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 'user-uuid' } },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(uploads);
    });
  });
});
