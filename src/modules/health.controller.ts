/**
 * Health check de la aplicación.
 * Expone un endpoint para verificar que el servidor está operativo.
 */
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check(): { status: string; timestamp: string } {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
