import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Case } from './entities/case.entity';

/** CRUD for success stories / case studies. Only published cases are public. */
@Injectable()
export class CasesService {
  constructor(
    @InjectRepository(Case)
    private casesRepository: Repository<Case>,
  ) {}

  /** Create a new case study. */
  async create(data: Partial<Case>): Promise<Case> {
    const caseEntity = this.casesRepository.create(data);
    return this.casesRepository.save(caseEntity);
  }

  /** List all published cases, newest first. */
  async findAll(): Promise<Case[]> {
    return this.casesRepository.find({
      where: { isPublished: true },
      order: { createdAt: 'DESC' },
    });
  }

  /** Get a single case by UUID. Throws if missing (regardless of publish status). */
  async findOne(id: string): Promise<Case> {
    const caseEntity = await this.casesRepository.findOne({ where: { id } });
    if (!caseEntity) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }
    return caseEntity;
  }

  /** Update a case study (partial update). */
  async update(id: string, data: Partial<Case>): Promise<Case> {
    const caseEntity = await this.findOne(id);
    Object.assign(caseEntity, data);
    return this.casesRepository.save(caseEntity);
  }

  /** Delete a case study. */
  async remove(id: string): Promise<void> {
    const caseEntity = await this.findOne(id);
    await this.casesRepository.remove(caseEntity);
  }
}
