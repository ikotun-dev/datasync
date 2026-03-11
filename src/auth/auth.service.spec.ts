import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

const mockFirebaseApp = {
  auth: () => ({
    verifyIdToken: jest.fn(),
  }),
};

describe('AuthService', () => {
  let service: AuthService;
  let verifyIdTokenMock: jest.Mock;

  // beforeEach runs before EVERY test — gives each test a fresh service
  beforeEach(async () => {
    verifyIdTokenMock = jest.fn();
    mockFirebaseApp.auth = () => ({ verifyIdToken: verifyIdTokenMock });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'FIREBASE_APP', 
          useValue: mockFirebaseApp, 
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return uid and email for a valid token', async () => {
    verifyIdTokenMock.mockResolvedValue({
      uid: 'firebase-uid-123',
      email: 'test@example.com',
    });

    const result = await service.verifyToken('valid-token');

    expect(result).toEqual({
      uid: 'firebase-uid-123',
      email: 'test@example.com',
    });
    expect(verifyIdTokenMock).toHaveBeenCalledWith('valid-token');
  });

  // Test 2: Invalid token throws UnauthorizedException
  it('should throw UnauthorizedException for an invalid token', async () => {
    verifyIdTokenMock.mockRejectedValue(new Error('Invalid token'));

    await expect(service.verifyToken('bad-token')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  // Test 3: Expired token throws UnauthorizedException
  it('should throw UnauthorizedException for an expired token', async () => {
    verifyIdTokenMock.mockRejectedValue(new Error('Token expired'));

    await expect(service.verifyToken('expired-token')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
