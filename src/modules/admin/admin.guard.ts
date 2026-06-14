/**
 * Guard de autorización para rutas de administración.
 * Verifica que el usuario autenticado tenga el rol 'admin'.
 */
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn('AdminGuard: No user in request');
      throw new ForbiddenException('Acceso denegado');
    }

    if (user.role !== UserRole.ADMIN) {
      this.logger.warn(`AdminGuard: User ${user.userId} is not admin`);
      throw new ForbiddenException('Se requieren permisos de administrador');
    }

    return true;
  }
}
