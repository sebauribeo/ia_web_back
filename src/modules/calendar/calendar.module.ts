/**
 * Módulo de calendario.
 * Agrupa el controlador y el servicio de calendario para la gestión
 * de reservas y disponibilidad horaria.
 */
import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';

@Module({
  providers: [CalendarService],
  controllers: [CalendarController],
  exports: [CalendarService],
})
export class CalendarModule {}
