/**
 * @fileoverview
 * DTO (Data Transfer Object) para la actualización parcial de usuarios.
 * Todos los campos son opcionales; solo se actualizan los campos enviados.
 */

import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

/**
 * DTO utilizado para la actualización de datos de un usuario.
 * Cada propiedad es opcional, permitiendo actualizaciones parciales.
 * Incluye validación de tipos y valores mediante class-validator.
 */
export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Juan Pérez' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'TechCorp' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ example: '+56 9 1234 5678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
