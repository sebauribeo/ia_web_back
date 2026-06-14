/**
 * Módulo de demostración.
 * Agrupa el controlador y servicio del agente de demo (A2)
 * para la página interactiva /demo.
 */
import { Module } from '@nestjs/common';
import { DemoService } from './demo.service';
import { DemoController } from './demo.controller';

@Module({
  providers: [DemoService],
  controllers: [DemoController],
  exports: [DemoService],
})
export class DemoModule {}
