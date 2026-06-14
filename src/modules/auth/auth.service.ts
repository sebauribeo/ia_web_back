import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.warn(`Login failed: user not found - ${email}`);
      throw new UnauthorizedException('Usuario no encontrado');
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

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    this.logger.log(`User logged in: ${user.email}`);
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(data: { email: string; password: string; name: string }) {
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) {
      this.logger.warn(`Registration failed: email already exists - ${data.email}`);
      throw new UnauthorizedException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      ...data,
      password: hashedPassword,
    });

    this.logger.log(`User registered successfully: ${user.email} (${user.id})`);

    return this.login(user);
  }
}
