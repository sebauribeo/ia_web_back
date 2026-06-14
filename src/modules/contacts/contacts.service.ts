/**
 * Servicio de contactos.
 * Maneja el envío de formularios de contacto, cotización y evaluación.
 * El método create es público; el resto requiere autenticación administrativa.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';

/** Handles contact form submissions (contact, quote, evaluation). */
@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
  ) {}

  /**
   * Envía un nuevo formulario de contacto. Endpoint público.
   * @param data - Datos parciales del contacto
   * @returns Contacto creado
   */
  async create(data: Partial<Contact>): Promise<Contact> {
    const contact = this.contactsRepository.create(data);
    return this.contactsRepository.save(contact);
  }

  /**
   * Obtiene todos los formularios de contacto, del más reciente al más antiguo.
   * Solo para administradores.
   * @returns Lista de contactos
   */
  async findAll(): Promise<Contact[]> {
    return this.contactsRepository.find({ order: { createdAt: 'DESC' } });
  }

  /**
   * Obtiene un formulario de contacto por su ID.
   * @param id - Identificador único del contacto
   * @returns Contacto encontrado
   */
  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactsRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  /**
   * Marca un formulario de contacto como leído.
   * @param id - Identificador único del contacto
   * @returns Contacto actualizado
   */
  async markAsRead(id: string): Promise<Contact> {
    const contact = await this.findOne(id);
    contact.isRead = true;
    return this.contactsRepository.save(contact);
  }

  /**
   * Elimina un formulario de contacto.
   * @param id - Identificador único del contacto
   */
  async remove(id: string): Promise<void> {
    const contact = await this.findOne(id);
    await this.contactsRepository.remove(contact);
  }
}
