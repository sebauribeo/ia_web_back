import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './admin.guard';
import { User } from '../users/entities/user.entity';
import { Service } from '../services/entities/service.entity';
import { Case } from '../cases/entities/case.entity';
import { Contact } from '../contacts/entities/contact.entity';
import { ChatLog } from '../chat/entities/chat-log.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Service)
    private servicesRepo: Repository<Service>,
    @InjectRepository(Case)
    private casesRepo: Repository<Case>,
    @InjectRepository(Contact)
    private contactsRepo: Repository<Contact>,
    @InjectRepository(ChatLog)
    private chatLogsRepo: Repository<ChatLog>,
  ) {}

  @Get('stats')
  async getStats() {
    const [users, services, cases, contacts, unreadContacts, chatLogs] = await Promise.all([
      this.usersRepo.count(),
      this.servicesRepo.count(),
      this.casesRepo.count(),
      this.contactsRepo.count(),
      this.contactsRepo.count({ where: { isRead: false } }),
      this.chatLogsRepo.count(),
    ]);
    return { users, services, cases, contacts, unreadContacts, chatLogs };
  }

  @Get('users')
  async getUsers() {
    const users = await this.usersRepo.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      order: { createdAt: 'DESC' },
    });
    return users;
  }

  @Patch('users/:id/role')
  async updateUserRole(@Param('id') id: string, @Body() body: { role: string }) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    user.role = body.role as any;
    await this.usersRepo.save(user);
    this.logger.log(`User role updated: ${user.email} → ${body.role}`);
    return user;
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    await this.usersRepo.remove(user);
    this.logger.log(`User deleted by admin: ${user.email}`);
    return { message: 'Usuario eliminado' };
  }

  @Get('services')
  async getServices() {
    return this.servicesRepo.find({ order: { sortOrder: 'ASC' } });
  }

  @Post('services')
  async createService(@Body() body: Partial<Service>) {
    const service = this.servicesRepo.create(body);
    const saved = await this.servicesRepo.save(service);
    this.logger.log(`Service created: ${saved.title}`);
    return saved;
  }

  @Put('services/:id')
  async updateService(@Param('id') id: string, @Body() body: Partial<Service>) {
    const service = await this.servicesRepo.findOne({ where: { id } });
    if (!service) throw new NotFoundException('Servicio no encontrado');
    Object.assign(service, body);
    const saved = await this.servicesRepo.save(service);
    this.logger.log(`Service updated: ${saved.title}`);
    return saved;
  }

  @Delete('services/:id')
  async deleteService(@Param('id') id: string) {
    const service = await this.servicesRepo.findOne({ where: { id } });
    if (!service) throw new NotFoundException('Servicio no encontrado');
    await this.servicesRepo.remove(service);
    this.logger.log(`Service deleted: ${service.title}`);
    return { message: 'Servicio eliminado' };
  }

  @Get('cases')
  async getCases() {
    return this.casesRepo.find({ order: { createdAt: 'DESC' } });
  }

  @Post('cases')
  async createCase(@Body() body: Partial<Case>) {
    const c = this.casesRepo.create(body);
    const saved = await this.casesRepo.save(c);
    this.logger.log(`Case created: ${saved.title}`);
    return saved;
  }

  @Put('cases/:id')
  async updateCase(@Param('id') id: string, @Body() body: Partial<Case>) {
    const c = await this.casesRepo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Caso no encontrado');
    Object.assign(c, body);
    const saved = await this.casesRepo.save(c);
    this.logger.log(`Case updated: ${saved.title}`);
    return saved;
  }

  @Delete('cases/:id')
  async deleteCase(@Param('id') id: string) {
    const c = await this.casesRepo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Caso no encontrado');
    await this.casesRepo.remove(c);
    this.logger.log(`Case deleted: ${c.title}`);
    return { message: 'Caso eliminado' };
  }

  @Get('contacts')
  async getContacts() {
    return this.contactsRepo.find({ order: { createdAt: 'DESC' } });
  }

  @Patch('contacts/:id/read')
  async markContactRead(@Param('id') id: string) {
    const contact = await this.contactsRepo.findOne({ where: { id } });
    if (!contact) throw new NotFoundException('Contacto no encontrado');
    contact.isRead = true;
    await this.contactsRepo.save(contact);
    return contact;
  }

  @Delete('contacts/:id')
  async deleteContact(@Param('id') id: string) {
    const contact = await this.contactsRepo.findOne({ where: { id } });
    if (!contact) throw new NotFoundException('Contacto no encontrado');
    await this.contactsRepo.remove(contact);
    return { message: 'Contacto eliminado' };
  }

  @Get('chat-logs')
  async getChatLogs() {
    return this.chatLogsRepo.find({
      order: { createdAt: 'DESC' },
      take: 200,
    });
  }
}
