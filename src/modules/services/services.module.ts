/**
 * @fileoverview
 * Módulo de servicios de NestJS.
 * Agrupa el controlador, servicio y entidad Service, registrando el repositorio
 * TypeORM y exportando el servicio para su uso en otros módulos.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service } from './entities/service.entity';

/**
 * Módulo encargado de la gestión del catálogo de servicios.
 * Importa TypeOrmFeature para la entidad Service, registra el controlador
 * y el servicio, y exporta ServicesService para consumidores externos.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  providers: [ServicesService],
  controllers: [ServicesController],
  exports: [ServicesService],
})
export class ServicesModule {}
