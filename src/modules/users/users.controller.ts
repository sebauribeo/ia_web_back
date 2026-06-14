/**
 * @fileoverview
 * Controlador REST del módulo de usuarios.
 * Todos los endpoints requieren autenticación JWT.
 * Proporciona operaciones de consulta, actualización y eliminación de usuarios.
 */

import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Obtiene la lista completa de usuarios registrados.
   * Requiere autenticación JWT.
   */
  @Get()
  @ApiOperation({ summary: 'Listar usuarios', description: 'Requiere JWT. Devuelve todos los usuarios.' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * Obtiene un usuario específico por su UUID.
   * Requiere autenticación JWT.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID', description: 'Requiere JWT. Busca por UUID.' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  /**
   * Actualiza parcialmente los datos de un usuario.
   * Solo se modifican los campos enviados en el cuerpo de la petición.
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar usuario', description: 'Requiere JWT. Actualiza campos parciales.' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async update(@Param('id') id: string, @Body() data: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, data);
  }

  /**
   * Elimina un usuario de forma permanente.
   * Requiere autenticación JWT.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar usuario', description: 'Requiere JWT. Elimina permanentemente.' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
