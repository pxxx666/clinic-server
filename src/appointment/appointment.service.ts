import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { EmailUtil } from '../common/utils/email.util';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private emailUtil: EmailUtil,
  ) {}

  async create(
    appointment: Omit<
      Appointment,
      'diagnosticResult' | 'drug' | 'doctorAdvice'
    >,
  ) {
    return this.appointmentRepository.save(appointment);
  }

  async findAll(
    page: number,
    limit: number,
    userId?: string,
    doctorId?: string,
    department?: string,
    appointmentTime?: string,
    status?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (userId) {
      where.userId = userId;
    }
    if (doctorId) {
      where.doctorId = doctorId;
    }
    if (department) {
      where.department = department;
    }
    if (appointmentTime) {
      where.appointmentTime = appointmentTime;
    }
    if (status) {
      where.status = status;
    }
    const [appointments, total] = await this.appointmentRepository.findAndCount(
      {
        where,
        skip,
        take: limit,
      },
    );
    return { data: appointments, total };
  }

  async findOne(id: number) {
    return this.appointmentRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateData: Pick<Appointment, 'diagnosticResult' | 'drug' | 'doctorAdvice'>,
  ) {
    await this.appointmentRepository.update(id, {
      ...updateData,
      status: '已结束',
    });
    return this.appointmentRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.appointmentRepository.delete(id);
    return { message: '预约信息删除成功' };
  }

  async callAppointment(id: number) {
    await this.appointmentRepository.update(id, { status: '就诊中' });
    const appointment = await this.findOne(id);
    await this.emailUtil.sendCallAppointment(
      appointment?.patientEmail || '',
      appointment!,
    );
    return { message: '预约信息发送成功' };
  }
}
