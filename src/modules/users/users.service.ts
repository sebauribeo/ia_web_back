import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(data);
    const saved = await this.usersRepository.save(user);
    this.logger.log(`User created: ${saved.email} (${saved.id})`);
    return saved;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`User not found by ID: ${id}`);
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, data);
    const updated = await this.usersRepository.save(user);
    this.logger.log(`User updated: ${updated.email} (${updated.id})`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    this.logger.log(`User deleted: ${user.email} (${user.id})`);
  }
}
