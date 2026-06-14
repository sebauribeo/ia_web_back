import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  const mockUser = {
    id: 'uuid-1',
    email: 'test@example.com',
    password: 'hashed',
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
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService) as jest.Mocked<UsersService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users', () => {
    it('debe retornar la lista de usuarios', async () => {
      const users = [mockUser];
      usersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('GET /users/:id', () => {
    it('debe retornar un usuario por ID', async () => {
      usersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('uuid-1');

      expect(usersService.findOne).toHaveBeenCalledWith('uuid-1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('PUT /users/:id', () => {
    it('debe actualizar y retornar el usuario', async () => {
      const dto: UpdateUserDto = { name: 'Updated Name' };
      const updated = { ...mockUser, name: 'Updated Name' };
      usersService.update.mockResolvedValue(updated);

      const result = await controller.update('uuid-1', dto);

      expect(usersService.update).toHaveBeenCalledWith('uuid-1', dto);
      expect(result).toEqual(updated);
    });
  });

  describe('DELETE /users/:id', () => {
    it('debe eliminar un usuario', async () => {
      usersService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('uuid-1');

      expect(usersService.remove).toHaveBeenCalledWith('uuid-1');
      expect(result).toBeUndefined();
    });
  });
});
