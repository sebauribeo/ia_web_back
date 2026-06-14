import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatLog } from './entities/chat-log.entity';

/**
 * Chatbot agent — A1 in AGENTS.md
 * Processes user messages via the floating chat widget.
 * Current: rule-based; future: LLM (OpenAI/Claude).
 * All messages are persisted to chat_logs for audit.
 */
@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatLog)
    private chatLogRepository: Repository<ChatLog>,
  ) {}

  /**
   * Process an incoming chat message.
   * Saves both user message and generated response to chat_logs.
   * @param message - Raw user input text
   * @param sessionId - Optional session identifier for context
   * @param userId - Optional authenticated user ID
   * @returns The assistant's response text
   */
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

    await this.chatLogRepository.save(
      this.chatLogRepository.create({
        sessionId,
        userId,
        role: 'assistant',
        content: response,
      })
    );

    return response;
  }

  /** Rule-based response generator. Replace with LLM call for production. */
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

  /** Get full message history for a session, oldest first. */
  async getHistory(sessionId: string): Promise<ChatLog[]> {
    return this.chatLogRepository.find({
      where: { sessionId },
      order: { createdAt: 'ASC' },
    });
  }
}
