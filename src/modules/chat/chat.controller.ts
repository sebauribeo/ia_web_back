/**
 * Controlador del módulo de chat.
 * Expone endpoints para enviar mensajes al agente chatbot (A1)
 * y consultar el historial de conversaciones por sesión.
 */
import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatLog } from './entities/chat-log.entity';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  /**
   * Envía un mensaje al chatbot y obtiene una respuesta.
   * El mensaje del usuario y la respuesta del asistente se persisten
   * en la tabla chat_logs.
   * @param body - Objeto con el mensaje, sessionId opcional y userId opcional
   * @returns Respuesta del asistente
   */
  @Post('message')
  @ApiOperation({
    summary: 'Send message to chatbot',
    description: 'Processes a user message through the Chatbot Agent (A1). Messages and responses are persisted to chat_logs.',
  })
  @ApiResponse({ status: 200, description: 'Returns the AI response text' })
  async sendMessage(
    @Body() body: { message: string; sessionId?: string; userId?: string },
  ): Promise<{ response: string }> {
    const response = await this.chatService.processMessage(
      body.message,
      body.sessionId,
      body.userId,
    );
    return { response };
  }

  /**
   * Obtiene el historial de mensajes de una sesión, ordenados por fecha de creación.
   * @param sessionId - Identificador único de la sesión
   * @returns Arreglo de entradas del chat
   */
  @Get('history')
  @ApiOperation({
    summary: 'Get chat history',
    description: 'Returns all messages for a given session, ordered by creation time.',
  })
  @ApiResponse({ status: 200, description: 'Array of chat log entries' })
  async getHistory(@Query('sessionId') sessionId: string): Promise<ChatLog[]> {
    return this.chatService.getHistory(sessionId);
  }
}
