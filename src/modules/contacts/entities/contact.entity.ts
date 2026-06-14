import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum ContactType {
  CONTACT = 'contact',
  QUOTE = 'quote',
  EVALUATION = 'evaluation',
}

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: ContactType,
    default: ContactType.CONTACT,
  })
  type: ContactType;

  @Column({ nullable: true })
  budget: string;

  @Column({ nullable: true })
  projectType: string;

  @Column('text')
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
