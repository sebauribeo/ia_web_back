import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';

describe('ServicesService', () => {
  let service: ServicesService;
  let repository: jest.Mocked<Repository<Service>>;

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
      providers: [
        ServicesService,
        {
          provide: getRepositoryToken(Service),
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

    service = module.get<ServicesService>(ServicesService);
    repository = module.get(getRepositoryToken(Service)) as jest.Mocked<Repository<Service>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear y retornar un servicio', async () => {
      repository.create.mockReturnValue(mockService);
      repository.save.mockResolvedValue(mockService);

      const result = await service.create({ title: 'New' });

      expect(repository.create).toHaveBeenCalledWith({ title: 'New' });
      expect(result).toEqual(mockService);
    });
  });

  describe('findAll', () => {
    it('debe retornar servicios ordenados por sortOrder', async () => {
      repository.find.mockResolvedValue([mockService]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({ order: { sortOrder: 'ASC' } });
      expect(result).toEqual([mockService]);
    });
  });

  describe('findOne', () => {
    it('debe retornar un servicio por ID', async () => {
      repository.findOne.mockResolvedValue(mockService);
      const result = await service.findOne('uuid-1');
      expect(result).toEqual(mockService);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.findOne('uuid-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar un servicio existente', async () => {
      repository.findOne.mockResolvedValue(mockService);
      const updated = { ...mockService, title: 'Updated' };
      repository.save.mockResolvedValue(updated);

      const result = await service.update('uuid-1', { title: 'Updated' });

      expect(result.title).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('debe eliminar un servicio existente', async () => {
      repository.findOne.mockResolvedValue(mockService);
      repository.remove.mockResolvedValue(mockService);

      await service.remove('uuid-1');

      expect(repository.remove).toHaveBeenCalledWith(mockService);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.remove('uuid-inexistente')).rejects.toThrow(NotFoundException);
    });
  });
});
