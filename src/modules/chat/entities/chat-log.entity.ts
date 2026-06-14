/**
 * Entidad de registro de chat.
 * Almacena cada mensaje enviado y recibido a través del agente chatbot (A1),
 * incluyendo el rol (usuario/asistente) y la sesión correspondiente.
 */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('chat_logs')
export class ChatLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  sessionId: string;

  @Column({ nullable: true })
  userId: string;

  @Column()
  role: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
