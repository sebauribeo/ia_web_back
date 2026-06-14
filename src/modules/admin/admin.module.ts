/**
 * Módulo de administración.
 * Agrupa el controlador y guard de administración,
 * e importa las entidades necesarias para TypeORM.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminGuard } from './admin.guard';
import { User } from '../users/entities/user.entity';
import { Service } from '../services/entities/service.entity';
import { Case } from '../cases/entities/case.entity';
import { Contact } from '../contacts/entities/contact.entity';
import { ChatLog } from '../chat/entities/chat-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Service, Case, Contact, ChatLog]),
  ],
  controllers: [AdminController],
  providers: [AdminGuard],
})
export class AdminModule {}
