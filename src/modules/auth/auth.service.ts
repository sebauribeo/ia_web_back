/**
 * Servicio de autenticación.
 * Contiene la lógica de validación de credenciales,
 * generación de tokens JWT, registro de usuarios y
 * recuperación/restablecimiento de contraseña.
 */
import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const BCRYPT_SALT_ROUNDS = 10;
const RESET_TOKEN_EXPIRY_MINUTES = 15;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.warn(`Login failed: user not found - ${email}`);
      throw new UnauthorizedException('Usuario no encontrado');
    }
    if (!user.isActive) {
      this.logger.warn(`Login failed: inactive user - ${email}`);
      throw new UnauthorizedException('Cuenta desactivada. Contacta al administrador.');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Login failed: invalid password - ${email}`);
      throw new UnauthorizedException('Contraseña incorrecta');
    }
    const { password: _, ...result } = user;
    this.logger.log(`User validated successfully: ${email}`);
    return result;
  }

  async login(user: Omit<User, 'password'>): Promise<{ access_token: string; user: { id: string; email: string; name: string; role: string } }> {
    const payload = { email: user.email, sub: user.id, role: user.role };
    await this.usersService.update(user.id, { lastLoginAt: new Date() });
    this.logger.log(`User logged in: ${user.email}`);
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(data: { email: string; password: string; name: string }): Promise<{ access_token: string; user: { id: string; email: string; name: string; role: string } }> {
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) {
      this.logger.warn(`Registration failed: email already exists - ${data.email}`);
      throw new UnauthorizedException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);
    const user = await this.usersService.create({
      ...data,
      password: hashedPassword,
    });

    this.logger.log(`User registered successfully: ${user.email} (${user.id})`);

    return this.login(user);
  }

  async forgotPassword(email: string): Promise<{ message: string; devToken: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.warn(`Forgot password: user not found - ${email}`);
      throw new UnauthorizedException('No existe una cuenta con ese email');
    }
    const token = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);
    await this.usersService.update(user.id, { resetToken: token, resetTokenExpires: expires });
    this.logger.log(`Password reset token generated for ${email}`);
    return {
      message: 'Código de recuperación generado. Revisa tu correo.',
      devToken: token,
    };
  }

  async resetPassword(email: string, token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('No existe una cuenta con ese email');
    }
    if (!user.resetToken || user.resetToken !== token) {
      throw new BadRequestException('Código de recuperación inválido');
    }
    if (!user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      throw new BadRequestException('El código de recuperación ha expirado');
    }
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    await this.usersService.update(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    });
    this.logger.log(`Password reset successfully for ${email}`);
    return { message: 'Contraseña actualizada exitosamente' };
  }
}
