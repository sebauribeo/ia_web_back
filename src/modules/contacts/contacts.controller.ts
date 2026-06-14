/**
 * Controlador del módulo de contactos.
 * Gestiona los formularios de contacto, cotización y evaluación.
 * El endpoint de creación es público; el resto requiere autenticación JWT.
 */
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { Contact } from './entities/contact.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  /**
   * Crea un nuevo contacto (público).
   * @param data - Datos parciales del contacto
   * @returns Contacto creado
   */
  @Post()
  @ApiOperation({ summary: 'Create contact' })
  @ApiResponse({ status: 201, description: 'Contact created successfully' })
  async create(@Body() data: Partial<Contact>): Promise<Contact> {
    return this.contactsService.create(data);
  }

  /**
   * Obtiene todos los contactos. Requiere autenticación.
   * @returns Lista de contactos
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all contacts' })
  async findAll(): Promise<Contact[]> {
    return this.contactsService.findAll();
  }

  /**
   * Obtiene un contacto por su ID. Requiere autenticación.
   * @param id - Identificador único del contacto
   * @returns Contacto encontrado
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get contact by ID' })
  async findOne(@Param('id') id: string): Promise<Contact> {
    return this.contactsService.findOne(id);
  }

  /**
   * Marca un contacto como leído. Requiere autenticación.
   * @param id - Identificador único del contacto
   * @returns Contacto actualizado
   */
  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark contact as read' })
  async markAsRead(@Param('id') id: string): Promise<Contact> {
    return this.contactsService.markAsRead(id);
  }

  /**
   * Elimina un contacto. Requiere autenticación.
   * @param id - Identificador único del contacto
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete contact' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.contactsService.remove(id);
  }
}
