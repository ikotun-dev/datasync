import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';

const mockGuard = { canActivate: jest.fn(() => true) };

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return the user from the request', () => {
      const mockUser = { id: 'uuid-1', email: 'test@example.com' };
      const req = { user: mockUser } as any;

      const result = controller.getProfile(req);

      expect(result).toEqual(mockUser);
    });
  });
});
