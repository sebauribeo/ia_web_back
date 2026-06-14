/**
 * DTO para la solicitud de inicio de sesión.
 * Valida que email y password sean proporcionados.
 */
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @ApiProperty({ example: 'securePassword123', description: 'User password' })
  @IsString()
  password: string;
}
