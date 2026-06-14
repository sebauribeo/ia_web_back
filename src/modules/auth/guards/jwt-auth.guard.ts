/**
 * Guard de autenticación JWT.
 * Verifica que las rutas protegidas reciban un token
 * JWT válido en el header Authorization: Bearer <token>.
 */
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  /** Extrae y verifica el token JWT del header de autorización */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      this.logger.warn('Missing Authorization header');
      throw new UnauthorizedException('Token requerido');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      this.logger.warn('Invalid Authorization header format');
      throw new UnauthorizedException('Formato de token inválido');
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET) as { sub: string; email: string; role: string };
      // Adjunta los datos del usuario al request para uso posterior
      request.user = { userId: payload.sub, email: payload.email, role: payload.role };
      return true;
    } catch {
      this.logger.warn('Invalid or expired JWT token');
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
