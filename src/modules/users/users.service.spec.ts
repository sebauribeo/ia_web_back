import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

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
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User)) as jest.Mocked<Repository<User>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('debe retornar un usuario cuando existe', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('uuid-1');

      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-1' } });
    });

    it('debe lanzar NotFoundException cuando el usuario no existe', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('uuid-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('debe retornar un usuario cuando el email existe', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
    });

    it('debe retornar null cuando el email no existe', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('debe crear y retornar un usuario', async () => {
      const data = { email: 'new@example.com', password: 'password', name: 'New' };
      const newUser = { ...mockUser, email: 'new@example.com', name: 'New' };

      repository.create.mockReturnValue(newUser);
      repository.save.mockResolvedValue(newUser);

      const result = await service.create(data);

      expect(result).toEqual(newUser);
      expect(repository.create).toHaveBeenCalledWith(data);
      expect(repository.save).toHaveBeenCalledWith(newUser);
    });
  });

  describe('update', () => {
    it('debe actualizar los campos del usuario', async () => {
      repository.findOne.mockResolvedValue(mockUser);
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      repository.save.mockResolvedValue(updatedUser);

      const result = await service.update('uuid-1', { name: 'Updated Name' });

      expect(result.name).toBe('Updated Name');
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('debe eliminar un usuario existente', async () => {
      repository.findOne.mockResolvedValue(mockUser);
      repository.remove.mockResolvedValue(mockUser);

      await service.remove('uuid-1');

      expect(repository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('uuid-inexistente')).rejects.toThrow(NotFoundException);
    });
  });
});
