import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Doctor } from './doctor.entity';
import { AppointmentService } from '../appointment/appointment.service';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,

    private appointmentService: AppointmentService,
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
    const where: any = {};
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
      where,
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

  async updateAuditStatus(id: string) {
    await this.doctorRepository.update(id, { auditStatus: '1' });
    return { message: `医生 ${id} 的审核状态已更新` };
  }

  async getDoctorStats(doctorId: string) {
    const doctor = await this.findOne(+doctorId);
    if (!doctor) {
      throw new Error('医生不存在');
    }
    const departmentDoctors = await this.findAll(1, 1000, doctor.department);
    const departmentDoctorCount = departmentDoctors.data.length;

    const doctorAppointmentCount = await this.appointmentService
      .findAll(1, 1000, undefined, doctorId)
      .then((res) => res.total);

    const doctorStats = await Promise.all(
      departmentDoctors.data.map(async (doc) => {
        const count = await this.appointmentService
          .findAll(1, 1000, undefined, doc.id.toString())
          .then((res) => res.total);
        return { id: doc.id, count };
      }),
    );

    doctorStats.sort((a, b) => b.count - a.count);
    const rank = doctorStats.findIndex((stat) => stat.id === +doctorId) + 1;

    return {
      totalAppointments: doctorAppointmentCount,
      rankInDepartment: rank,
      departmentDoctorCount,
    };
  }
}
