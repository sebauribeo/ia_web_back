import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  const mockExecutionContext = (authHeader: string | null): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: authHeader,
          },
        }),
      }),
    }) as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('canActivate', () => {
    it('debe retornar true con un token válido', () => {
      const payload = { sub: 'uuid-1', email: 'test@example.com', role: 'client' };
      jest.spyOn(jwt, 'verify').mockReturnValue(payload as any);

      const context = mockExecutionContext('Bearer valid-token');
      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String));
    });

    it('debe lanzar UnauthorizedException cuando no hay token', () => {
      const context = mockExecutionContext(null);

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('debe lanzar UnauthorizedException cuando el token es inválido', () => {
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const context = mockExecutionContext('Bearer invalid-token');

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('debe lanzar UnauthorizedException cuando el formato del header es incorrecto', () => {
      const context = mockExecutionContext('InvalidFormat token');

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });
  });
});
