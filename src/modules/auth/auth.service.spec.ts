import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: User = {
    id: 'uuid-1',
    email: 'test@example.com',
    password: 'hashed-password',
    name: 'Test User',
    company: null,
    phone: null,
    role: UserRole.CLIENT,
    isActive: true,
    lastLoginAt: null,
    resetToken: null,
    resetTokenExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService) as jest.Mocked<UsersService>;
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('debe retornar el usuario sin contraseña cuando las credenciales son válidas', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('test@example.com');
    });

    it('debe lanzar UnauthorizedException cuando el usuario no existe', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.validateUser('notfound@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('debe lanzar UnauthorizedException cuando la contraseña es incorrecta', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('test@example.com', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('debe lanzar UnauthorizedException cuando el usuario está inactivo', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      usersService.findByEmail.mockResolvedValue(inactiveUser);

      await expect(
        service.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('debe retornar un access_token y datos del usuario', async () => {
      jwtService.sign.mockReturnValue('jwt-token');
      usersService.update.mockResolvedValue(mockUser);

      const result = await service.login(mockUser);

      expect(result.access_token).toBe('jwt-token');
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
        role: mockUser.role,
      });
    });
  });

  describe('register', () => {
    it('debe crear un usuario y retornar JWT', async () => {
      const registerData = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      };

      usersService.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-new-password');
      usersService.create.mockResolvedValue({ ...mockUser, email: 'new@example.com', name: 'New User' });
      jwtService.sign.mockReturnValue('jwt-token');
      usersService.update.mockResolvedValue({ ...mockUser, email: 'new@example.com', name: 'New User' });

      const result = await service.register(registerData);

      expect(result.access_token).toBe('jwt-token');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(usersService.create).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'hashed-new-password',
        name: 'New User',
      });
    });

    it('debe rechazar email duplicado', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register({ email: 'test@example.com', password: 'password123', name: 'Test' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgotPassword', () => {
    it('debe generar un token de recuperación', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      usersService.update.mockResolvedValue(mockUser);

      const result = await service.forgotPassword('test@example.com');

      expect(result).toHaveProperty('devToken');
      expect(result.message).toBe('Código de recuperación generado. Revisa tu correo.');
      expect(usersService.update).toHaveBeenCalled();
      const updateCall = usersService.update.mock.calls[0][1];
      expect(updateCall).toHaveProperty('resetToken');
      expect(updateCall).toHaveProperty('resetTokenExpires');
    });

    it('debe lanzar excepción cuando el email no existe', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.forgotPassword('notfound@example.com'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('resetPassword', () => {
    it('debe restablecer la contraseña con token válido', async () => {
      const futureDate = new Date(Date.now() + 3600000);
      const userWithToken = {
        ...mockUser,
        resetToken: '123456',
        resetTokenExpires: futureDate,
      };

      usersService.findByEmail.mockResolvedValue(userWithToken);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed-password');
      usersService.update.mockResolvedValue(userWithToken);

      const result = await service.resetPassword('test@example.com', '123456', 'new-password');

      expect(result.message).toBe('Contraseña actualizada exitosamente');
      expect(usersService.update).toHaveBeenCalledWith('uuid-1', {
        password: 'new-hashed-password',
        resetToken: null,
        resetTokenExpires: null,
      });
    });

    it('debe lanzar excepción cuando el token ha expirado', async () => {
      const pastDate = new Date(Date.now() - 3600000);
      const userWithExpiredToken = {
        ...mockUser,
        resetToken: '123456',
        resetTokenExpires: pastDate,
      };

      usersService.findByEmail.mockResolvedValue(userWithExpiredToken);

      await expect(
        service.resetPassword('test@example.com', '123456', 'new-password'),
      ).rejects.toThrow(BadRequestException);
    });

    it('debe lanzar excepción cuando el token es incorrecto', async () => {
      const futureDate = new Date(Date.now() + 3600000);
      const userWithToken = {
        ...mockUser,
        resetToken: '123456',
        resetTokenExpires: futureDate,
      };

      usersService.findByEmail.mockResolvedValue(userWithToken);

      await expect(
        service.resetPassword('test@example.com', 'wrong-token', 'new-password'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
