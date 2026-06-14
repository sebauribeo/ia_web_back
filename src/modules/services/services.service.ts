import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';

/** CRUD operations for the service catalog (Chatbots, Automation, Agents). */
@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  /** Create a new service entry. */
  async create(data: Partial<Service>): Promise<Service> {
    const service = this.servicesRepository.create(data);
    return this.servicesRepository.save(service);
  }

  /** List all services ordered by sortOrder ASC. */
  async findAll(): Promise<Service[]> {
    return this.servicesRepository.find({ order: { sortOrder: 'ASC' } });
  }

  /** Get a single service by UUID. Throws NotFoundException if missing. */
  async findOne(id: string): Promise<Service> {
    const service = await this.servicesRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  /** Update an existing service (partial update). */
  async update(id: string, data: Partial<Service>): Promise<Service> {
    const service = await this.findOne(id);
    Object.assign(service, data);
    return this.servicesRepository.save(service);
  }

  /** Delete a service by ID. */
  async remove(id: string): Promise<void> {
    const service = await this.findOne(id);
    await this.servicesRepository.remove(service);
  }
}
