import { Test, TestingModule } from '@nestjs/testing';
import { DemoService } from './demo.service';

describe('DemoService', () => {
  let service: DemoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemoService],
    }).compile();

    service = module.get<DemoService>(DemoService);
  });

  describe('processDemoMessage', () => {
    it('debe responder a saludos con "hola"', async () => {
      const response = await service.processDemoMessage('hola');
      expect(response).toContain('¡Hola!');
    });

    it('debe responder a saludos con "hi"', async () => {
      const response = await service.processDemoMessage('hi');
      expect(response).toContain('¡Hola!');
    });

    it('debe responder a consultas de servicios', async () => {
      const response = await service.processDemoMessage('qué servicios ofrecen');
      expect(response).toContain('Chatbots Inteligentes');
      expect(response).toContain('Automatización de Procesos');
      expect(response).toContain('Agentes Autónomos');
    });

    it('debe responder a consultas sobre chatbots', async () => {
      const response = await service.processDemoMessage('chatbot');
      expect(response).toContain('NLP avanzado');
    });

    it('debe responder a consultas sobre automatización', async () => {
      const response = await service.processDemoMessage('automatización');
      expect(response).toContain('Eliminar tareas repetitivas');
    });

    it('debe responder a consultas sobre precios', async () => {
      const response = await service.processDemoMessage('precio');
      expect(response).toContain('$5,000 CLP/mes');
      expect(response).toContain('$15,000 CLP/mes');
    });

    it('debe retornar respuesta por defecto para mensajes desconocidos', async () => {
      const response = await service.processDemoMessage('otra cosa');
      expect(response).toContain('agendar una reunión');
    });
  });
});
