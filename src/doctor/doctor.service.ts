import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Doctor } from './doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async create(doctor: Doctor) {
    // 确保 education 字段是数组
    if (typeof doctor.education === 'string') {
      doctor.education = [doctor.education];
    }
    return this.doctorRepository.save(doctor);
  }

  async findAll(
    page: number,
    limit: number,
    department?: string,
    title?: string,
    schedule?: string,
    auditStatus?: string,
    name?: string,
  ) {
    const skip = (page - 1) * limit;
    const where = {};
    if (department) {
      where.department = department;
    }
    if (title) {
      where.title = title;
    }
    if (schedule) {
      where.schedule = Like(`%${schedule}%`);
    }
    if (auditStatus) {
      where.auditStatus = auditStatus;
    }
    if (name) {
      where.name = Like(`%${name}%`);
    }
    const [departments, total] = await this.doctorRepository.findAndCount({
      skip,
      take: limit,
    });
    return { data: departments, total };
  }

  async findOne(id: number) {
    return this.doctorRepository.findOne({ where: { id } });
  }

  async update(id: number, doctor: Doctor) {
    // 确保 education 字段是数组
    if (typeof doctor.education === 'string') {
      doctor.education = [doctor.education];
    }
    await this.doctorRepository.update(id, doctor);
    return this.doctorRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.doctorRepository.delete(id);
    return { message: '医生信息删除成功' };
  }

  updateAuditStatus(id: string) {
    return { message: `医生 ${id} 的审核状态已更新` };
  }
}
