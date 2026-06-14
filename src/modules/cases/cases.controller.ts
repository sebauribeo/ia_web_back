/**
 * Controlador del módulo de casos de éxito.
 * Expone endpoints REST para listar, crear, actualizar y eliminar
 * casos de estudio. Las operaciones de escritura requieren autenticación.
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
import { CasesService } from './cases.service';
import { Case } from './entities/case.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('cases')
@Controller('cases')
export class CasesController {
  constructor(private casesService: CasesService) {}

  /**
   * Obtiene todos los casos de éxito publicados.
   * @returns Lista de casos de éxito
   */
  @Get()
  @ApiOperation({ summary: 'Get all cases' })
  async findAll(): Promise<Case[]> {
    return this.casesService.findAll();
  }

  /**
   * Obtiene un caso de éxito por su ID.
   * @param id - Identificador único del caso
   * @returns Caso de éxito encontrado
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get case by ID' })
  async findOne(@Param('id') id: string): Promise<Case> {
    return this.casesService.findOne(id);
  }

  /**
   * Crea un nuevo caso de éxito.
   * Requiere autenticación JWT.
   * @param data - Datos parciales del caso
   * @returns Caso de éxito creado
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create case' })
  async create(@Body() data: Partial<Case>): Promise<Case> {
    return this.casesService.create(data);
  }

  /**
   * Actualiza un caso de éxito existente.
   * Requiere autenticación JWT.
   * @param id - Identificador único del caso
   * @param data - Datos parciales a actualizar
   * @returns Caso de éxito actualizado
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update case' })
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Case>,
  ): Promise<Case> {
    return this.casesService.update(id, data);
  }

  /**
   * Elimina un caso de éxito.
   * Requiere autenticación JWT.
   * @param id - Identificador único del caso
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete case' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.casesService.remove(id);
  }
}
