import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';
import { UserRole } from '../../users/entities/user.entity';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get(AuthService) as jest.Mocked<AuthService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe validar usuario con email y contraseña', async () => {
    const mockUser = {
      id: 'uuid-1',
      email: 'test@example.com',
      name: 'Test',
      role: UserRole.CLIENT,
      company: null,
      phone: null,
      isActive: true,
      lastLoginAt: null,
      resetToken: null,
      resetTokenExpires: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    authService.validateUser.mockResolvedValue(mockUser);

    const result = await strategy.validate('test@example.com', 'password');

    expect(authService.validateUser).toHaveBeenCalledWith('test@example.com', 'password');
    expect(result).toEqual(mockUser);
  });
});
