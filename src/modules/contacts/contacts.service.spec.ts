import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactsService } from './contacts.service';
import { Contact, ContactType } from './entities/contact.entity';

describe('ContactsService', () => {
  let service: ContactsService;
  let repository: jest.Mocked<Repository<Contact>>;

  const mockContact: Contact = {
    id: 'uuid-1',
    name: 'John',
    email: 'john@example.com',
    company: 'Acme',
    phone: '123456789',
    message: 'Hello',
    type: ContactType.CONTACT,
    budget: null,
    projectType: null,
    isRead: false,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: getRepositoryToken(Contact),
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

    service = module.get<ContactsService>(ContactsService);
    repository = module.get(getRepositoryToken(Contact)) as jest.Mocked<Repository<Contact>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear y retornar un contacto', async () => {
      repository.create.mockReturnValue(mockContact);
      repository.save.mockResolvedValue(mockContact);

      const result = await service.create({ name: 'John' });

      expect(repository.create).toHaveBeenCalledWith({ name: 'John' });
      expect(result).toEqual(mockContact);
    });
  });

  describe('findAll', () => {
    it('debe retornar todos los contactos ordenados', async () => {
      repository.find.mockResolvedValue([mockContact]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({ order: { createdAt: 'DESC' } });
      expect(result).toEqual([mockContact]);
    });
  });

  describe('findOne', () => {
    it('debe retornar un contacto por ID', async () => {
      repository.findOne.mockResolvedValue(mockContact);
      const result = await service.findOne('uuid-1');
      expect(result).toEqual(mockContact);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.findOne('uuid-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  describe('markAsRead', () => {
    it('debe marcar como leído', async () => {
      repository.findOne.mockResolvedValue(mockContact);
      const read = { ...mockContact, isRead: true };
      repository.save.mockResolvedValue(read);

      const result = await service.markAsRead('uuid-1');

      expect(result.isRead).toBe(true);
    });
  });

  describe('remove', () => {
    it('debe eliminar un contacto existente', async () => {
      repository.findOne.mockResolvedValue(mockContact);
      repository.remove.mockResolvedValue(mockContact);

      await service.remove('uuid-1');

      expect(repository.remove).toHaveBeenCalledWith(mockContact);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.remove('uuid-inexistente')).rejects.toThrow(NotFoundException);
    });
  });
});
