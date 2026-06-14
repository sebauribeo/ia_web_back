/**
 * Servicio de casos de éxito.
 * Gestiona el CRUD de casos de estudio. Solo los casos publicados
 * son visibles al público.
 */
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

  /**
   * Crea un nuevo caso de estudio.
   * @param data - Datos parciales del caso
   * @returns Caso de estudio creado
   */
  async create(data: Partial<Case>): Promise<Case> {
    const caseEntity = this.casesRepository.create(data);
    return this.casesRepository.save(caseEntity);
  }

  /**
   * Obtiene todos los casos publicados, ordenados del más reciente al más antiguo.
   * @returns Lista de casos publicados
   */
  async findAll(): Promise<Case[]> {
    return this.casesRepository.find({
      where: { isPublished: true },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Obtiene un caso por su UUID. Lanza una excepción si no existe,
   * independientemente de su estado de publicación.
   * @param id - Identificador único del caso
   * @returns Caso encontrado
   */
  async findOne(id: string): Promise<Case> {
    const caseEntity = await this.casesRepository.findOne({ where: { id } });
    if (!caseEntity) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }
    return caseEntity;
  }

  /**
   * Actualiza un caso de estudio de forma parcial.
   * @param id - Identificador único del caso
   * @param data - Datos parciales a actualizar
   * @returns Caso actualizado
   */
  async update(id: string, data: Partial<Case>): Promise<Case> {
    const caseEntity = await this.findOne(id);
    Object.assign(caseEntity, data);
    return this.casesRepository.save(caseEntity);
  }

  /**
   * Elimina un caso de estudio.
   * @param id - Identificador único del caso
   */
  async remove(id: string): Promise<void> {
    const caseEntity = await this.findOne(id);
    await this.casesRepository.remove(caseEntity);
  }
}
