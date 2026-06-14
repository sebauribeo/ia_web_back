import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { Contact, ContactType } from './entities/contact.entity';

describe('ContactsController', () => {
  let controller: ContactsController;
  let contactsService: jest.Mocked<ContactsService>;

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
      controllers: [ContactsController],
      providers: [
        {
          provide: ContactsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            markAsRead: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
    contactsService = module.get(ContactsService) as jest.Mocked<ContactsService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create debe crear un contacto', async () => {
    contactsService.create.mockResolvedValue(mockContact);
    const data: Partial<Contact> = { name: 'John', email: 'john@example.com' };
    const result = await controller.create(data);
    expect(contactsService.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(mockContact);
  });

  it('findAll debe retornar todos los contactos', async () => {
    contactsService.findAll.mockResolvedValue([mockContact]);
    const result = await controller.findAll();
    expect(result).toEqual([mockContact]);
  });

  it('findOne debe retornar un contacto por ID', async () => {
    contactsService.findOne.mockResolvedValue(mockContact);
    const result = await controller.findOne('uuid-1');
    expect(result).toEqual(mockContact);
  });

  it('markAsRead debe marcar como leído', async () => {
    const read = { ...mockContact, isRead: true };
    contactsService.markAsRead.mockResolvedValue(read);
    const result = await controller.markAsRead('uuid-1');
    expect(contactsService.markAsRead).toHaveBeenCalledWith('uuid-1');
    expect(result.isRead).toBe(true);
  });

  it('remove debe eliminar un contacto', async () => {
    contactsService.remove.mockResolvedValue(undefined);
    await controller.remove('uuid-1');
    expect(contactsService.remove).toHaveBeenCalledWith('uuid-1');
  });
});
