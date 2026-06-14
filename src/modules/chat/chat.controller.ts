import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('message')
  @ApiOperation({
    summary: 'Send message to chatbot',
    description: 'Processes a user message through the Chatbot Agent (A1). Messages and responses are persisted to chat_logs.',
  })
  @ApiResponse({ status: 200, description: 'Returns the AI response text' })
  async sendMessage(
    @Body() body: { message: string; sessionId?: string; userId?: string },
  ) {
    const response = await this.chatService.processMessage(
      body.message,
      body.sessionId,
      body.userId,
    );
    return { response };
  }

  @Get('history')
  @ApiOperation({
    summary: 'Get chat history',
    description: 'Returns all messages for a given session, ordered by creation time.',
  })
  @ApiResponse({ status: 200, description: 'Array of chat log entries' })
  async getHistory(@Query('sessionId') sessionId: string) {
    return this.chatService.getHistory(sessionId);
  }
}
