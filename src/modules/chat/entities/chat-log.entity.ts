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
