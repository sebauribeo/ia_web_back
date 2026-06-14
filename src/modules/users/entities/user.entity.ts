/**
 * @fileoverview
 * Entidad TypeORM que representa un usuario de la plataforma.
 * Incluye autenticación, roles, control de sesión y marcas temporales.
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Enumeración de roles disponibles para los usuarios.
 * - CLIENT: Usuario cliente estándar.
 * - ADMIN: Administrador con privilegios de gestión.
 */
export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
}

/**
 * Entidad que modela un usuario registrado en AI Platform.
 * Almacena credenciales de autenticación, datos de perfil, rol,
 * estado de actividad, fecha del último inicio de sesión y tokens
 * de restablecimiento de contraseña.
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true })
  resetTokenExpires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
