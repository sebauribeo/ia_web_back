import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CasesService } from './cases.service';
import { Case } from './entities/case.entity';

describe('CasesService', () => {
  let service: CasesService;
  let repository: jest.Mocked<Repository<Case>>;

  const mockCase: Case = {
    id: 'uuid-1',
    title: 'Case Title',
    description: 'Desc',
    clientName: 'Client',
    clientCompany: 'Company',
    industry: 'Tech',
    image: '',
    results: ['Result 1'],
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CasesService,
        {
          provide: getRepositoryToken(Case),
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

    service = module.get<CasesService>(CasesService);
    repository = module.get(getRepositoryToken(Case)) as jest.Mocked<Repository<Case>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear y retornar un caso', async () => {
      repository.create.mockReturnValue(mockCase);
      repository.save.mockResolvedValue(mockCase);

      const result = await service.create({ title: 'New Case' });

      expect(repository.create).toHaveBeenCalledWith({ title: 'New Case' });
      expect(repository.save).toHaveBeenCalledWith(mockCase);
      expect(result).toEqual(mockCase);
    });
  });

  describe('findAll', () => {
    it('debe retornar solo casos publicados', async () => {
      repository.find.mockResolvedValue([mockCase]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        where: { isPublished: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockCase]);
    });
  });

  describe('findOne', () => {
    it('debe retornar un caso por ID', async () => {
      repository.findOne.mockResolvedValue(mockCase);

      const result = await service.findOne('uuid-1');

      expect(result).toEqual(mockCase);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('uuid-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar un caso existente', async () => {
      repository.findOne.mockResolvedValue(mockCase);
      const updated = { ...mockCase, title: 'Updated' };
      repository.save.mockResolvedValue(updated);

      const result = await service.update('uuid-1', { title: 'Updated' });

      expect(result.title).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('debe eliminar un caso existente', async () => {
      repository.findOne.mockResolvedValue(mockCase);
      repository.remove.mockResolvedValue(mockCase);

      await service.remove('uuid-1');

      expect(repository.remove).toHaveBeenCalledWith(mockCase);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('uuid-inexistente')).rejects.toThrow(NotFoundException);
    });
  });
});
