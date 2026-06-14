/**
 * @fileoverview
 * Entidad TypeORM que representa un servicio del catálogo de AI Platform.
 * Almacena información como título, descripción, icono, características y casos de uso.
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entidad que modela un servicio ofrecido en la plataforma (Chatbots, Automatización, Agentes).
 * Cada servicio tiene un título, descripción, icono, lista de características y casos de uso,
 * además de control de orden y visibilidad.
 */
@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  icon: string;

  @Column('simple-array')
  features: string[];

  @Column('simple-array')
  useCases: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
