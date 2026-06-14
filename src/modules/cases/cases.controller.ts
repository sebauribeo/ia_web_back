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

  @Get()
  @ApiOperation({ summary: 'Get all cases' })
  async findAll(): Promise<Case[]> {
    return this.casesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get case by ID' })
  async findOne(@Param('id') id: string): Promise<Case> {
    return this.casesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create case' })
  async create(@Body() data: Partial<Case>): Promise<Case> {
    return this.casesService.create(data);
  }

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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete case' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.casesService.remove(id);
  }
}
