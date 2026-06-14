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

  @Post()
  @ApiOperation({ summary: 'Create contact' })
  @ApiResponse({ status: 201, description: 'Contact created successfully' })
  async create(@Body() data: Partial<Contact>): Promise<Contact> {
    return this.contactsService.create(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all contacts' })
  async findAll(): Promise<Contact[]> {
    return this.contactsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get contact by ID' })
  async findOne(@Param('id') id: string): Promise<Contact> {
    return this.contactsService.findOne(id);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark contact as read' })
  async markAsRead(@Param('id') id: string): Promise<Contact> {
    return this.contactsService.markAsRead(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete contact' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.contactsService.remove(id);
  }
}
