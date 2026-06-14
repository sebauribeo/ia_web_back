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

  /** Submit a new contact form entry. Public endpoint. */
  async create(data: Partial<Contact>): Promise<Contact> {
    const contact = this.contactsRepository.create(data);
    return this.contactsRepository.save(contact);
  }

  /** List all contact submissions, newest first. Admin only. */
  async findAll(): Promise<Contact[]> {
    return this.contactsRepository.find({ order: { createdAt: 'DESC' } });
  }

  /** Get a single contact submission by ID. */
  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactsRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  /** Mark a contact submission as read. */
  async markAsRead(id: string): Promise<Contact> {
    const contact = await this.findOne(id);
    contact.isRead = true;
    return this.contactsRepository.save(contact);
  }

  /** Delete a contact submission. */
  async remove(id: string): Promise<void> {
    const contact = await this.findOne(id);
    await this.contactsRepository.remove(contact);
  }
}
