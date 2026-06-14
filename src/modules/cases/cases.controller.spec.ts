import { Test, TestingModule } from '@nestjs/testing';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { Case } from './entities/case.entity';

describe('CasesController', () => {
  let controller: CasesController;
  let casesService: jest.Mocked<CasesService>;

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
      controllers: [CasesController],
      providers: [
        {
          provide: CasesService,
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

    controller = module.get<CasesController>(CasesController);
    casesService = module.get(CasesService) as jest.Mocked<CasesService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('findAll debe retornar todos los casos', async () => {
    casesService.findAll.mockResolvedValue([mockCase]);
    const result = await controller.findAll();
    expect(result).toEqual([mockCase]);
  });

  it('findOne debe retornar un caso por ID', async () => {
    casesService.findOne.mockResolvedValue(mockCase);
    const result = await controller.findOne('uuid-1');
    expect(result).toEqual(mockCase);
  });

  it('create debe crear un caso', async () => {
    casesService.create.mockResolvedValue(mockCase);
    const data: Partial<Case> = { title: 'New Case' };
    const result = await controller.create(data);
    expect(casesService.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(mockCase);
  });

  it('update debe actualizar un caso', async () => {
    const updated = { ...mockCase, title: 'Updated' };
    casesService.update.mockResolvedValue(updated);
    const data: Partial<Case> = { title: 'Updated' };
    const result = await controller.update('uuid-1', data);
    expect(casesService.update).toHaveBeenCalledWith('uuid-1', data);
    expect(result.title).toBe('Updated');
  });

  it('remove debe eliminar un caso', async () => {
    casesService.remove.mockResolvedValue(undefined);
    await controller.remove('uuid-1');
    expect(casesService.remove).toHaveBeenCalledWith('uuid-1');
  });
});
