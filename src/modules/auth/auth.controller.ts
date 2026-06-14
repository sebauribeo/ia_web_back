/**
 * Controlador de autenticación.
 * Expone endpoints para login, registro, solicitud de
 * recuperación y restablecimiento de contraseña.
 */
import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from '../users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión', description: 'Autentica con email + password. Devuelve JWT.' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, type: AuthResponseDto, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Usuario no encontrado o contraseña incorrecta' })
  async login(@Request() req: { user: Omit<User, 'password'> }): Promise<AuthResponseDto> {
    return this.authService.login(req.user);
  }

  /** Registra un nuevo usuario y devuelve JWT */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar usuario', description: 'Crea una cuenta nueva y devuelve JWT.' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, type: AuthResponseDto, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos (email, longitud de contraseña, etc.)' })
  @ApiResponse({ status: 401, description: 'El email ya está registrado' })
  async register(@Body() body: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(body);
  }

  /** Solicita un código de recuperación de contraseña */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar código de recuperación' })
  async forgotPassword(@Body('email') email: string): Promise<{ message: string; devToken: string }> {
    return this.authService.forgotPassword(email);
  }

  /** Restablece la contraseña usando el código de recuperación */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restablecer contraseña con código' })
  async resetPassword(@Body() body: { email: string; token: string; newPassword: string }): Promise<{ message: string }> {
    return this.authService.resetPassword(body.email, body.token, body.newPassword);
  }
}
