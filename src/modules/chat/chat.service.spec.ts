import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatService } from './chat.service';
import { ChatLog } from './entities/chat-log.entity';

describe('ChatService', () => {
  let service: ChatService;
  let repository: jest.Mocked<Repository<ChatLog>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getRepositoryToken(ChatLog),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    repository = module.get(getRepositoryToken(ChatLog)) as jest.Mocked<Repository<ChatLog>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateResponse', () => {
    it('debe responder a saludos', async () => {
      repository.create.mockReturnValue({} as ChatLog);
      repository.save.mockResolvedValue({} as ChatLog);

      const response = await service.processMessage('hola');
      expect(response).toBe('¡Hola! ¿Cómo puedo ayudarte hoy?');
    });

    it('debe responder a "hi"', async () => {
      repository.create.mockReturnValue({} as ChatLog);
      repository.save.mockResolvedValue({} as ChatLog);

      const response = await service.processMessage('hi');
      expect(response).toBe('¡Hola! ¿Cómo puedo ayudarte hoy?');
    });

    it('debe responder a consultas de servicios', async () => {
      repository.create.mockReturnValue({} as ChatLog);
      repository.save.mockResolvedValue({} as ChatLog);

      const response = await service.processMessage('qué servicios ofrecen');
      expect(response).toBe('Ofrecemos chatbots, automatización de procesos y agentes autónomos.');
    });

    it('debe responder a consultas de precios', async () => {
      repository.create.mockReturnValue({} as ChatLog);
      repository.save.mockResolvedValue({} as ChatLog);

      const response = await service.processMessage('cuál es el precio');
      expect(response).toBe('Nuestros planes comienzan desde $5,000 CLP/mes. ¿Te gustaría una cotización?');
    });

    it('debe retornar respuesta por defecto para mensajes desconocidos', async () => {
      repository.create.mockReturnValue({} as ChatLog);
      repository.save.mockResolvedValue({} as ChatLog);

      const response = await service.processMessage('otra cosa');
      expect(response).toBe('Gracias por tu mensaje. ¿En qué puedo ayudarte?');
    });
  });

  describe('processMessage', () => {
    it('debe guardar mensaje de usuario y respuesta en la BD', async () => {
      repository.create.mockReturnValue({} as ChatLog);
      repository.save.mockResolvedValue({} as ChatLog);

      const response = await service.processMessage('hola', 'session-1', 'user-1');

      expect(repository.save).toHaveBeenCalledTimes(2);
      expect(repository.create).toHaveBeenCalledTimes(2);
      expect(response).toBe('¡Hola! ¿Cómo puedo ayudarte hoy?');
    });

    it('debe guardar mensaje con sessionId opcional', async () => {
      repository.create.mockReturnValue({} as ChatLog);
      repository.save.mockResolvedValue({} as ChatLog);

      await service.processMessage('hola');

      expect(repository.save).toHaveBeenCalledTimes(2);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'user', content: 'hola' }),
      );
    });
  });
});
