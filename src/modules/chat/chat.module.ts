/**
 * Módulo de chat.
 * Configura el agente chatbot (A1) con persistencia en la tabla chat_logs
 * a través de TypeORM.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatLog } from './entities/chat-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatLog])],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
