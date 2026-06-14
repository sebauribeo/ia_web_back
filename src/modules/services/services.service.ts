/**
 * @fileoverview
 * Servicio que implementa la lógica de negocio para el catálogo de servicios.
 * Proporciona operaciones CRUD completas sobre la entidad Service.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';

/**
 * Servicio encargado de las operaciones CRUD del catálogo de servicios
 * (Chatbots, Automatización, Agentes autónomos).
 */
@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  /**
   * Crea una nueva entrada de servicio en el catálogo.
   * @param data - Datos parciales del servicio a crear.
   * @returns El servicio recién creado.
   */
  async create(data: Partial<Service>): Promise<Service> {
    const service = this.servicesRepository.create(data);
    return this.servicesRepository.save(service);
  }

  /**
   * Obtiene todos los servicios ordenados por sortOrder ascendente.
   * @returns Lista completa de servicios.
   */
  async findAll(): Promise<Service[]> {
    return this.servicesRepository.find({ order: { sortOrder: 'ASC' } });
  }

  /**
   * Busca un servicio por su UUID.
   * Lanza una excepción NotFoundException si no existe.
   * @param id - UUID del servicio.
   * @returns El servicio encontrado.
   */
  async findOne(id: string): Promise<Service> {
    const service = await this.servicesRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  /**
   * Actualiza parcialmente un servicio existente.
   * @param id  - UUID del servicio a actualizar.
   * @param data - Campos a modificar.
   * @returns El servicio actualizado.
   */
  async update(id: string, data: Partial<Service>): Promise<Service> {
    const service = await this.findOne(id);
    Object.assign(service, data);
    return this.servicesRepository.save(service);
  }

  /**
   * Elimina un servicio del catálogo por su UUID.
   * @param id - UUID del servicio a eliminar.
   */
  async remove(id: string): Promise<void> {
    const service = await this.findOne(id);
    await this.servicesRepository.remove(service);
  }
}
