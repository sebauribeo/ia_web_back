/**
 * @fileoverview
 * Controlador REST del módulo de servicios.
 * Expone endpoints CRUD para gestionar el catálogo de servicios de AI Platform.
 * Las operaciones de escritura (POST, PUT, DELETE) requieren autenticación JWT.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  /**
   * Obtiene todos los servicios activos/inactivos ordenados por sortOrder ascendente.
   * Endpoint público, no requiere autenticación.
   */
  @Get()
  @ApiOperation({ summary: 'Get all services' })
  async findAll(): Promise<Service[]> {
    return this.servicesService.findAll();
  }

  /**
   * Obtiene un servicio específico por su UUID.
   * Endpoint público.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  async findOne(@Param('id') id: string): Promise<Service> {
    return this.servicesService.findOne(id);
  }

  /**
   * Crea un nuevo servicio en el catálogo.
   * Requiere autenticación JWT (administradores).
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create service' })
  async create(@Body() data: Partial<Service>): Promise<Service> {
    return this.servicesService.create(data);
  }

  /**
   * Actualiza parcialmente un servicio existente.
   * Requiere autenticación JWT.
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update service' })
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Service>,
  ): Promise<Service> {
    return this.servicesService.update(id, data);
  }

  /**
   * Elimina un servicio del catálogo de forma permanente.
   * Requiere autenticación JWT.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete service' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.servicesService.remove(id);
  }
}
