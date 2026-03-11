import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase-auth.guard';
import { User, UserRole } from 'src/user/entities/user.entity';

// Mock all FormService methods
const mockFormService = {
  submitForm: jest.fn(),
  getMySubmissions: jest.fn(),
  getUploadsForUser: jest.fn(),
  getLatestSubmission: jest.fn(),
  uploadToUserA: jest.fn(),
};

const mockGuard = { canActivate: jest.fn(() => true) }; //firebase mock guard

//fake User A for form operations
const mockUserA: Partial<User> = {
  id: 'user-uuid-123',
  email: 'usera@test.com',
  firebaseUid: 'firebase-uid-123',
  role: UserRole.USER_A,
};

//fake User B for upload/view operations
const mockUserB: Partial<User> = {
  id: 'user-uuid-456',
  email: 'userb@test.com',
  firebaseUid: 'firebase-uid-456',
  role: UserRole.USER_B,
};

describe('FormController', () => {
  let controller: FormController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormController],
      providers: [{ provide: FormService, useValue: mockFormService }],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<FormController>(FormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  // USER A — Tests

  describe('submitForm', () => {
    it('should call formService.submitForm with user and dto', async () => {
      const fakeDto = { name: 'Acme Corp', noOfUsers: 500, noOfProducts: 50 };
      const mockResult = { id: 'company-uuid', ...fakeDto, percentage: 1000 };
      mockFormService.submitForm.mockResolvedValue(mockResult);

      const req = { user: mockUserA } as Request & { user: User };
      const result = await controller.submitForm(req, fakeDto);

      expect(mockFormService.submitForm).toHaveBeenCalledWith(mockUserA, fakeDto);
      expect(result).toEqual(mockResult);
    });

    it('should reject User B from submitting forms', async () => {
      const fakeDto = { name: 'Acme Corp', noOfUsers: 500, noOfProducts: 50 };
      const req = { user: mockUserB } as Request & { user: User };

      expect(() => controller.submitForm(req, fakeDto)).toThrow(ForbiddenException);
    });
  });

  describe('getMySubmissions', () => {
    it('should call formService.getMySubmissions with user', async () => {
      const mockSubmissions = [{ id: '1', name: 'Acme' }];
      mockFormService.getMySubmissions.mockResolvedValue(mockSubmissions);

      const req = { user: mockUserA } as Request & { user: User };
      const result = await controller.getMySubmissions(req);

      expect(mockFormService.getMySubmissions).toHaveBeenCalledWith(mockUserA);
      expect(result).toEqual(mockSubmissions);
    });

    it('should reject User B from viewing submissions', async () => {
      const req = { user: mockUserB } as Request & { user: User };
      expect(() => controller.getMySubmissions(req)).toThrow(ForbiddenException);
    });
  });

  describe('getMyUploads', () => {
    it('should call formService.getUploadsForUser with user id', async () => {
      const mockUploads = [{ id: '1', fileUrl: 'https://example.com/img.png' }];
      mockFormService.getUploadsForUser.mockResolvedValue(mockUploads);

      const req = { user: mockUserA } as Request & { user: User };
      const result = await controller.getMyUploads(req);

      expect(mockFormService.getUploadsForUser).toHaveBeenCalledWith('user-uuid-123');
      expect(result).toEqual(mockUploads);
    });

    it('should reject User B from viewing uploads', async () => {
      const req = { user: mockUserB } as Request & { user: User };
      expect(() => controller.getMyUploads(req)).toThrow(ForbiddenException);
    });
  });

  // USER B — Tests
  describe('getLatestSubmission', () => {
    it('should call formService.getLatestSubmission with userAId', async () => {
      const mockLatest = { id: '1', name: 'Acme', percentage: 1000 };
      mockFormService.getLatestSubmission.mockResolvedValue(mockLatest);

      const req = { user: mockUserB } as Request & { user: User };
      const result = await controller.getLatestSubmission(req, 'user-a-uuid');

      expect(mockFormService.getLatestSubmission).toHaveBeenCalledWith('user-a-uuid');
      expect(result).toEqual(mockLatest);
    });

    it('should reject User A from viewing another user\'s submissions', async () => {
      const req = { user: mockUserA } as Request & { user: User };
      expect(() => controller.getLatestSubmission(req, 'user-a-uuid')).toThrow(ForbiddenException);
    });
  });

  describe('uploadFile', () => {
    it('should call formService.uploadToUserA with user entity and file', async () => {
      const mockFile = {
        originalname: 'test.png',
        buffer: Buffer.from('fake-image'),
        mimetype: 'image/png',
      } as Express.Multer.File;

      const mockUpload = { id: '1', fileUrl: 'https://cloudinary.com/img.png' };
      mockFormService.uploadToUserA.mockResolvedValue(mockUpload);

      const req = { user: mockUserB } as Request & { user: User };
      const result = await controller.uploadFile(req, 'user-a-uuid', mockFile);

      expect(mockFormService.uploadToUserA).toHaveBeenCalledWith(
        { id: 'user-a-uuid' },
        mockFile,
      );
      expect(result).toEqual(mockUpload);
    });

    it('should reject User A from uploading files', async () => {
      const mockFile = {
        originalname: 'test.png',
        buffer: Buffer.from('fake-image'),
        mimetype: 'image/png',
      } as Express.Multer.File;

      const req = { user: mockUserA } as Request & { user: User };
      await expect(controller.uploadFile(req, 'user-a-uuid', mockFile)).rejects.toThrow(ForbiddenException);
    });
  });
});
