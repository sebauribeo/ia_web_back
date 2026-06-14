import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';

describe('ServicesController', () => {
  let controller: ServicesController;
  let servicesService: jest.Mocked<ServicesService>;

  const mockService: Service = {
    id: 'uuid-1',
    title: 'Service Title',
    description: 'Desc',
    icon: 'Icon',
    features: ['Feat 1'],
    useCases: ['Use 1'],
    sortOrder: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        {
          provide: ServicesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);
    servicesService = module.get(ServicesService) as jest.Mocked<ServicesService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('findAll debe retornar todos los servicios', async () => {
    servicesService.findAll.mockResolvedValue([mockService]);
    const result = await controller.findAll();
    expect(result).toEqual([mockService]);
  });

  it('findOne debe retornar un servicio por ID', async () => {
    servicesService.findOne.mockResolvedValue(mockService);
    const result = await controller.findOne('uuid-1');
    expect(result).toEqual(mockService);
  });

  it('create debe crear un servicio', async () => {
    servicesService.create.mockResolvedValue(mockService);
    const data: Partial<Service> = { title: 'New Service' };
    const result = await controller.create(data);
    expect(servicesService.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(mockService);
  });

  it('update debe actualizar un servicio', async () => {
    const updated = { ...mockService, title: 'Updated' };
    servicesService.update.mockResolvedValue(updated);
    const result = await controller.update('uuid-1', { title: 'Updated' });
    expect(servicesService.update).toHaveBeenCalledWith('uuid-1', { title: 'Updated' });
    expect(result.title).toBe('Updated');
  });

  it('remove debe eliminar un servicio', async () => {
    servicesService.remove.mockResolvedValue(undefined);
    await controller.remove('uuid-1');
    expect(servicesService.remove).toHaveBeenCalledWith('uuid-1');
  });
});
