import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ai-platform-secret-key';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

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
      const payload = jwt.verify(token, JWT_SECRET) as { sub: string; email: string };
      request.user = { userId: payload.sub, email: payload.email };
      return true;
    } catch {
      this.logger.warn('Invalid or expired JWT token');
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
