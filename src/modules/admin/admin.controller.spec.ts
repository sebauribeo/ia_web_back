import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AdminController } from './admin.controller';
import { User, UserRole } from '../users/entities/user.entity';
import { Service } from '../services/entities/service.entity';
import { Case } from '../cases/entities/case.entity';
import { Contact } from '../contacts/entities/contact.entity';
import { ChatLog } from '../chat/entities/chat-log.entity';
import { ContactType } from '../contacts/entities/contact.entity';

describe('AdminController', () => {
  let controller: AdminController;
  let usersRepo: jest.Mocked<Repository<User>>;
  let servicesRepo: jest.Mocked<Repository<Service>>;
  let casesRepo: jest.Mocked<Repository<Case>>;
  let contactsRepo: jest.Mocked<Repository<Contact>>;
  let chatLogsRepo: jest.Mocked<Repository<ChatLog>>;

  const mockUser: User = {
    id: 'uuid-1',
    email: 'admin@example.com',
    password: 'hashed',
    name: 'Admin User',
    company: null,
    phone: null,
    role: UserRole.ADMIN,
    isActive: true,
    lastLoginAt: new Date(),
    resetToken: null,
    resetTokenExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService: Service = {
    id: 'uuid-svc',
    title: 'Chatbots',
    description: 'Desc',
    icon: 'MessageSquare',
    features: ['NLP'],
    useCases: ['Soporte'],
    sortOrder: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCase: Case = {
    id: 'uuid-case',
    title: 'Caso Exitoso',
    description: 'Desc',
    clientName: 'Client',
    clientCompany: 'Co',
    industry: 'Tech',
    results: ['Result'],
    image: '',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockContact: Contact = {
    id: 'uuid-contact',
    name: 'John',
    email: 'john@test.com',
    company: 'Acme',
    phone: '123',
    message: 'Hello',
    type: ContactType.CONTACT,
    budget: null,
    projectType: null,
    isRead: false,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: {
            count: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Service),
          useValue: {
            count: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Case),
          useValue: {
            count: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Contact),
          useValue: {
            count: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ChatLog),
          useValue: {
            count: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    usersRepo = module.get(getRepositoryToken(User)) as jest.Mocked<Repository<User>>;
    servicesRepo = module.get(getRepositoryToken(Service)) as jest.Mocked<Repository<Service>>;
    casesRepo = module.get(getRepositoryToken(Case)) as jest.Mocked<Repository<Case>>;
    contactsRepo = module.get(getRepositoryToken(Contact)) as jest.Mocked<Repository<Contact>>;
    chatLogsRepo = module.get(getRepositoryToken(ChatLog)) as jest.Mocked<Repository<ChatLog>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /admin/stats', () => {
    it('debe retornar todas las estadísticas', async () => {
      usersRepo.count.mockResolvedValue(10);
      servicesRepo.count.mockResolvedValue(5);
      casesRepo.count.mockResolvedValue(3);
      contactsRepo.count.mockResolvedValue(8);
      contactsRepo.count.mockResolvedValueOnce(8).mockResolvedValueOnce(2);
      chatLogsRepo.count.mockResolvedValue(50);

      const result = await controller.getStats();

      expect(usersRepo.count).toHaveBeenCalled();
      expect(servicesRepo.count).toHaveBeenCalled();
      expect(casesRepo.count).toHaveBeenCalled();
      expect(contactsRepo.count).toHaveBeenCalledTimes(2);
      expect(chatLogsRepo.count).toHaveBeenCalled();
      expect(result).toEqual({
        users: 10,
        services: 5,
        cases: 3,
        contacts: 8,
        unreadContacts: 2,
        chatLogs: 50,
      });
    });
  });

  describe('GET /admin/users', () => {
    it('debe retornar la lista de usuarios sin contraseñas', async () => {
      const users = [mockUser];
      usersRepo.find.mockResolvedValue(users);

      const result = await controller.getUsers();

      expect(usersRepo.find).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          company: true,
          phone: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(users);
    });
  });

  describe('PATCH /admin/users/:id/role', () => {
    it('debe actualizar el rol de un usuario', async () => {
      usersRepo.findOne.mockResolvedValue(mockUser);
      const updatedUser = { ...mockUser, role: UserRole.ADMIN };
      usersRepo.save.mockResolvedValue(updatedUser);

      const result = await controller.updateUserRole('uuid-1', { role: UserRole.ADMIN });

      expect(usersRepo.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-1' } });
      expect(usersRepo.save).toHaveBeenCalled();
      expect(result.role).toBe(UserRole.ADMIN);
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      usersRepo.findOne.mockResolvedValue(null);

      await expect(
        controller.updateUserRole('uuid-inexistente', { role: UserRole.ADMIN }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('PATCH /admin/users/:id/status', () => {
    it('debe desactivar un usuario activo', async () => {
      const activeUser = { ...mockUser, isActive: true };
      usersRepo.findOne.mockResolvedValue(activeUser);
      usersRepo.save.mockResolvedValue({ ...activeUser, isActive: false });

      const result = await controller.toggleUserStatus('uuid-1');

      expect(usersRepo.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-1' } });
      expect(result.isActive).toBe(false);
    });

    it('debe activar un usuario inactivo', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      usersRepo.findOne.mockResolvedValue(inactiveUser);
      usersRepo.save.mockResolvedValue({ ...inactiveUser, isActive: true });

      const result = await controller.toggleUserStatus('uuid-1');

      expect(result.isActive).toBe(true);
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      usersRepo.findOne.mockResolvedValue(null);

      await expect(
        controller.toggleUserStatus('uuid-inexistente'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('DELETE /admin/users/:id', () => {
    it('debe eliminar un usuario existente', async () => {
      usersRepo.findOne.mockResolvedValue(mockUser);
      usersRepo.remove.mockResolvedValue(mockUser);

      const result = await controller.deleteUser('uuid-1');

      expect(usersRepo.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-1' } });
      expect(usersRepo.remove).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ message: 'Usuario eliminado' });
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      usersRepo.findOne.mockResolvedValue(null);
      await expect(controller.deleteUser('uuid-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  describe('GET /admin/services', () => {
    it('debe retornar la lista de servicios', async () => {
      servicesRepo.find.mockResolvedValue([mockService]);
      const result = await controller.getServices();
      expect(servicesRepo.find).toHaveBeenCalledWith({ order: { sortOrder: 'ASC' } });
      expect(result).toEqual([mockService]);
    });
  });

  describe('POST /admin/services', () => {
    it('debe crear un nuevo servicio', async () => {
      servicesRepo.create.mockReturnValue(mockService);
      servicesRepo.save.mockResolvedValue(mockService);

      const result = await controller.createService({ title: 'Chatbots' });

      expect(servicesRepo.create).toHaveBeenCalledWith({ title: 'Chatbots' });
      expect(result).toEqual(mockService);
    });
  });

  describe('PUT /admin/services/:id', () => {
    it('debe actualizar un servicio existente', async () => {
      servicesRepo.findOne.mockResolvedValue(mockService);
      const updated = { ...mockService, title: 'Updated' };
      servicesRepo.save.mockResolvedValue(updated);

      const result = await controller.updateService('uuid-svc', { title: 'Updated' });

      expect(servicesRepo.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-svc' } });
      expect(result.title).toBe('Updated');
    });

    it('debe lanzar NotFoundException si el servicio no existe', async () => {
      servicesRepo.findOne.mockResolvedValue(null);
      await expect(controller.updateService('uuid-inexistente', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('DELETE /admin/services/:id', () => {
    it('debe eliminar un servicio existente', async () => {
      servicesRepo.findOne.mockResolvedValue(mockService);
      servicesRepo.remove.mockResolvedValue(mockService);

      const result = await controller.deleteService('uuid-svc');

      expect(servicesRepo.remove).toHaveBeenCalledWith(mockService);
      expect(result).toEqual({ message: 'Servicio eliminado' });
    });

    it('debe lanzar NotFoundException si el servicio no existe', async () => {
      servicesRepo.findOne.mockResolvedValue(null);
      await expect(controller.deleteService('uuid-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  describe('GET /admin/cases', () => {
    it('debe retornar la lista de casos', async () => {
      casesRepo.find.mockResolvedValue([mockCase]);
      const result = await controller.getCases();
      expect(casesRepo.find).toHaveBeenCalledWith({ order: { createdAt: 'DESC' } });
      expect(result).toEqual([mockCase]);
    });
  });

  describe('POST /admin/cases', () => {
    it('debe crear un nuevo caso', async () => {
      casesRepo.create.mockReturnValue(mockCase);
      casesRepo.save.mockResolvedValue(mockCase);

      const result = await controller.createCase({ title: 'Nuevo Caso' });

      expect(casesRepo.create).toHaveBeenCalledWith({ title: 'Nuevo Caso' });
      expect(result).toEqual(mockCase);
    });
  });

  describe('PUT /admin/cases/:id', () => {
    it('debe actualizar un caso existente', async () => {
      casesRepo.findOne.mockResolvedValue(mockCase);
      const updated = { ...mockCase, title: 'Updated' };
      casesRepo.save.mockResolvedValue(updated);

      const result = await controller.updateCase('uuid-case', { title: 'Updated' });

      expect(casesRepo.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-case' } });
      expect(result.title).toBe('Updated');
    });

    it('debe lanzar NotFoundException si el caso no existe', async () => {
      casesRepo.findOne.mockResolvedValue(null);
      await expect(controller.updateCase('uuid-inexistente', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('DELETE /admin/cases/:id', () => {
    it('debe eliminar un caso existente', async () => {
      casesRepo.findOne.mockResolvedValue(mockCase);
      casesRepo.remove.mockResolvedValue(mockCase);

      const result = await controller.deleteCase('uuid-case');

      expect(casesRepo.remove).toHaveBeenCalledWith(mockCase);
      expect(result).toEqual({ message: 'Caso eliminado' });
    });

    it('debe lanzar NotFoundException si el caso no existe', async () => {
      casesRepo.findOne.mockResolvedValue(null);
      await expect(controller.deleteCase('uuid-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  describe('GET /admin/contacts', () => {
    it('debe retornar la lista de contactos', async () => {
      contactsRepo.find.mockResolvedValue([mockContact]);
      const result = await controller.getContacts();
      expect(contactsRepo.find).toHaveBeenCalledWith({ order: { createdAt: 'DESC' } });
      expect(result).toEqual([mockContact]);
    });
  });

  describe('PATCH /admin/contacts/:id/read', () => {
    it('debe marcar un contacto como leído', async () => {
      contactsRepo.findOne.mockResolvedValue(mockContact);
      const read = { ...mockContact, isRead: true };
      contactsRepo.save.mockResolvedValue(read);

      const result = await controller.markContactRead('uuid-contact');

      expect(contactsRepo.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-contact' } });
      expect(result.isRead).toBe(true);
    });

    it('debe lanzar NotFoundException si el contacto no existe', async () => {
      contactsRepo.findOne.mockResolvedValue(null);
      await expect(controller.markContactRead('uuid-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  describe('DELETE /admin/contacts/:id', () => {
    it('debe eliminar un contacto existente', async () => {
      contactsRepo.findOne.mockResolvedValue(mockContact);
      contactsRepo.remove.mockResolvedValue(mockContact);

      const result = await controller.deleteContact('uuid-contact');

      expect(contactsRepo.remove).toHaveBeenCalledWith(mockContact);
      expect(result).toEqual({ message: 'Contacto eliminado' });
    });

    it('debe lanzar NotFoundException si el contacto no existe', async () => {
      contactsRepo.findOne.mockResolvedValue(null);
      await expect(controller.deleteContact('uuid-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  describe('GET /admin/chat-logs', () => {
    it('debe retornar los últimos 200 logs del chat', async () => {
      const logs = [{ id: '1', sessionId: 'sess-1', role: 'user', content: 'hola', createdAt: new Date() }];
      chatLogsRepo.find.mockResolvedValue(logs as ChatLog[]);

      const result = await controller.getChatLogs();

      expect(chatLogsRepo.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        take: 200,
      });
      expect(result).toEqual(logs);
    });
  });
});
