import { ForbiddenException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import { UserRole } from '../users/entities/user.entity';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  beforeEach(() => {
    guard = new AdminGuard();
  });

  const mockExecutionContext = (user: Record<string, unknown> | null): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as ExecutionContext;

  it('debe permitir acceso a usuario con rol admin', () => {
    const context = mockExecutionContext({ userId: 'uuid-1', role: UserRole.ADMIN });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('debe denegar acceso a usuario con rol no-admin', () => {
    const context = mockExecutionContext({ userId: 'uuid-2', role: UserRole.CLIENT });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('debe denegar acceso cuando no hay usuario en la solicitud', () => {
    const context = mockExecutionContext(null);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
