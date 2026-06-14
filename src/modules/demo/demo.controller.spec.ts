import { Test, TestingModule } from '@nestjs/testing';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';

describe('DemoController', () => {
  let controller: DemoController;
  let demoService: jest.Mocked<DemoService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemoController],
      providers: [
        {
          provide: DemoService,
          useValue: {
            processDemoMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DemoController>(DemoController);
    demoService = module.get(DemoService) as jest.Mocked<DemoService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /demo/message', () => {
    it('debe procesar un mensaje y retornar respuesta', async () => {
      demoService.processDemoMessage.mockResolvedValue('Respuesta de demo');

      const result = await controller.sendMessage({ message: 'hola' });

      expect(demoService.processDemoMessage).toHaveBeenCalledWith('hola');
      expect(result).toEqual({ response: 'Respuesta de demo' });
    });
  });
});
