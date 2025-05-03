import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async create(department: Department) {
    return this.departmentRepository.save(department);
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [departments, total] = await this.departmentRepository.findAndCount({
      skip,
      take: limit,
    });
    return { data: departments, total };
  }

  async findOne(id: number) {
    return this.departmentRepository.findOne({ where: { id } });
  }

  async update(id: number, department: Department) {
    await this.departmentRepository.update(id, department);
    return this.departmentRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.departmentRepository.delete(id);
    return { message: '科室删除成功' };
  }
}
