import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatLog } from './entities/chat-log.entity';

describe('ChatController', () => {
  let controller: ChatController;
  let chatService: jest.Mocked<ChatService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: {
            processMessage: jest.fn(),
            getHistory: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    chatService = module.get(ChatService) as jest.Mocked<ChatService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /chat/message', () => {
    it('debe procesar un mensaje y retornar respuesta', async () => {
      chatService.processMessage.mockResolvedValue('¡Hola! ¿Cómo puedo ayudarte?');

      const result = await controller.sendMessage({ message: 'hola' });

      expect(chatService.processMessage).toHaveBeenCalledWith('hola', undefined, undefined);
      expect(result).toEqual({ response: '¡Hola! ¿Cómo puedo ayudarte?' });
    });

    it('debe pasar sessionId y userId cuando se proporcionan', async () => {
      chatService.processMessage.mockResolvedValue('Respuesta');

      await controller.sendMessage({ message: 'hola', sessionId: 'sess-1', userId: 'user-1' });

      expect(chatService.processMessage).toHaveBeenCalledWith('hola', 'sess-1', 'user-1');
    });
  });

  describe('GET /chat/history', () => {
    it('debe retornar el historial de una sesión', async () => {
      const history = [{ id: '1', sessionId: 'sess-1', role: 'user', content: 'hola', createdAt: new Date() }];
      chatService.getHistory.mockResolvedValue(history as ChatLog[]);

      const result = await controller.getHistory('sess-1');

      expect(chatService.getHistory).toHaveBeenCalledWith('sess-1');
      expect(result).toEqual(history);
    });
  });
});
