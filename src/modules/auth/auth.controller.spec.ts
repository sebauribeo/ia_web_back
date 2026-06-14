import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockUser = {
    id: 'uuid-1',
    email: 'test@example.com',
    name: 'Test User',
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

  const mockAuthResponse = {
    access_token: 'jwt-token',
    user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            forgotPassword: jest.fn(),
            resetPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService) as jest.Mocked<AuthService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    it('debe llamar a authService.login con el usuario de la solicitud', async () => {
      authService.login.mockResolvedValue(mockAuthResponse);

      const req = { user: mockUser };
      const result = await controller.login(req);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('POST /auth/register', () => {
    it('debe llamar a authService.register con los datos del cuerpo', async () => {
      authService.register.mockResolvedValue(mockAuthResponse);

      const body: RegisterDto = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      };
      const result = await controller.register(body);

      expect(authService.register).toHaveBeenCalledWith(body);
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('debe llamar a authService.forgotPassword con el email', async () => {
      const mockResponse = { message: 'Código generado', devToken: '123456' };
      authService.forgotPassword.mockResolvedValue(mockResponse);

      const result = await controller.forgotPassword('test@example.com');

      expect(authService.forgotPassword).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('POST /auth/reset-password', () => {
    it('debe llamar a authService.resetPassword con email, token y nueva contraseña', async () => {
      const mockResponse = { message: 'Contraseña actualizada exitosamente' };
      authService.resetPassword.mockResolvedValue(mockResponse);

      const body = { email: 'test@example.com', token: '123456', newPassword: 'new-password' };
      const result = await controller.resetPassword(body);

      expect(authService.resetPassword).toHaveBeenCalledWith(
        'test@example.com',
        '123456',
        'new-password',
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
