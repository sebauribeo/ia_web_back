/**
 * @fileoverview
 * Módulo de usuarios de NestJS.
 * Agrupa el controlador, servicio y entidad User, registrando el repositorio
 * TypeORM y exportando el servicio para su uso en otros módulos (ej. autenticación).
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

/**
 * Módulo encargado de la gestión de usuarios.
 * Importa TypeOrmFeature para la entidad User, registra el controlador
 * y el servicio, y exporta UsersService para que otros módulos
 * (como AuthModule) puedan utilizarlo.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
