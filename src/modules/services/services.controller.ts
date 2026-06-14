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

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  async findAll(): Promise<Service[]> {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  async findOne(@Param('id') id: string): Promise<Service> {
    return this.servicesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create service' })
  async create(@Body() data: Partial<Service>): Promise<Service> {
    return this.servicesService.create(data);
  }

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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete service' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.servicesService.remove(id);
  }
}
