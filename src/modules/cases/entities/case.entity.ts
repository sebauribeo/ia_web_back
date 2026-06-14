/**
 * Entidad de caso de éxito.
 * Representa un caso de estudio en la base de datos, incluyendo
 * detalles del cliente, resultados, industria y estado de publicación.
 */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cases')
export class Case {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  clientName: string;

  @Column()
  clientCompany: string;

  @Column({ nullable: true })
  image: string;

  @Column('simple-array')
  results: string[];

  @Column({ nullable: true })
  industry: string;

  @Column({ default: true })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
