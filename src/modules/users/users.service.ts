/**
 * @fileoverview
 * Servicio que implementa la lógica de negocio para la gestión de usuarios.
 * Proporciona operaciones CRUD, búsqueda por email, y registro de acciones
 * mediante el sistema de logging de NestJS.
 */

import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

/**
 * Servicio encargado de las operaciones CRUD y consultas de usuarios.
 * Incluye logging de acciones importantes como creación, actualización
 * y eliminación de usuarios.
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Crea un nuevo usuario en la base de datos.
   * @param data - Datos parciales del usuario a crear.
   * @returns El usuario recién creado.
   */
  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(data);
    const saved = await this.usersRepository.save(user);
    this.logger.log(`User created: ${saved.email} (${saved.id})`);
    return saved;
  }

  /**
   * Obtiene todos los usuarios registrados.
   * @returns Lista completa de usuarios.
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Busca un usuario por su UUID.
   * Lanza una excepción NotFoundException si no existe.
   * @param id - UUID del usuario.
   * @returns El usuario encontrado.
   */
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`User not found by ID: ${id}`);
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  /**
   * Busca un usuario por su dirección de email.
   * Útil para el flujo de autenticación (login).
   * @param email - Email del usuario.
   * @returns El usuario encontrado o null si no existe.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Actualiza parcialmente un usuario existente.
   * @param id   - UUID del usuario a actualizar.
   * @param data - Campos a modificar.
   * @returns El usuario actualizado.
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, data);
    const updated = await this.usersRepository.save(user);
    this.logger.log(`User updated: ${updated.email} (${updated.id})`);
    return updated;
  }

  /**
   * Elimina un usuario de la base de datos por su UUID.
   * @param id - UUID del usuario a eliminar.
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    this.logger.log(`User deleted: ${user.email} (${user.id})`);
  }
}
