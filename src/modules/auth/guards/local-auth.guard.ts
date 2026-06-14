/**
 * Guard de autenticación local (email + password).
 * Delega la validación a Passport con la estrategia local.
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
