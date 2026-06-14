/**
 * Servicio del agente chatbot (A1).
 * Procesa mensajes de usuarios a través del widget flotante de chat.
 * Actualmente usa un sistema basado en reglas; en el futuro se integrará
 * con LLM (OpenAI/Claude). Todos los mensajes se persisten en chat_logs.
 */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatLog } from './entities/chat-log.entity';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(ChatLog)
    private chatLogRepository: Repository<ChatLog>,
  ) {}

  async processMessage(
    message: string,
    sessionId?: string,
    userId?: string,
  ): Promise<string> {
    await this.chatLogRepository.save(
      this.chatLogRepository.create({
        sessionId,
        userId,
        role: 'user',
        content: message,
      })
    );

    const response = this.generateResponse(message);

    try {
      await this.chatLogRepository.save(
        this.chatLogRepository.create({
          sessionId,
          userId,
          role: 'assistant',
          content: response,
        })
      );
    } catch (error) {
      this.logger.error(`Failed to persist assistant response: ${error.message}`);
    }

    return response;
  }

  /**
   * Generador de respuestas basado en reglas.
   * Reemplazar con llamada a LLM para producción.
   * @param message - Texto de entrada del usuario
   * @returns Respuesta generada según palabras clave detectadas
   */
  private generateResponse(message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes('hola') || lower.includes('hi')) {
      return '¡Hola! ¿Cómo puedo ayudarte hoy?';
    }
    if (lower.includes('servicio')) {
      return 'Ofrecemos chatbots, automatización de procesos y agentes autónomos.';
    }
    if (lower.includes('precio')) {
      return 'Nuestros planes comienzan desde $5,000 CLP/mes. ¿Te gustaría una cotización?';
    }

    return 'Gracias por tu mensaje. ¿En qué puedo ayudarte?';
  }

  /**
   * Obtiene el historial completo de mensajes de una sesión, ordenados del más antiguo al más reciente.
   * @param sessionId - Identificador único de la sesión
   * @returns Lista de entradas del chat
   */
  async getHistory(sessionId: string): Promise<ChatLog[]> {
    return this.chatLogRepository.find({
      where: { sessionId },
      order: { createdAt: 'ASC' },
    });
  }
}
