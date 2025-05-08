import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluation } from './evaluation.entity';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(Evaluation)
    private evaluationRepository: Repository<Evaluation>,
  ) {}

  async getEvaluationByAppointmentId(appointmentId: number) {
    return this.evaluationRepository.findOne({ where: { appointmentId } });
  }

  async create(evaluation: Omit<Evaluation, 'id'>) {
    return this.evaluationRepository.save(evaluation);
  }

  async findAll() {
    return this.evaluationRepository.find();
  }

  async findOne(id: number) {
    return this.evaluationRepository.findOne({ where: { appointmentId: id } });
  }

  async findByDoctorId(doctorId: number) {
    return this.evaluationRepository.find({
      where: { doctorId: doctorId.toString() },
    });
  }

  async update(id: number, updateData: Partial<Evaluation>) {
    await this.evaluationRepository.update({ appointmentId: id }, updateData);
    return this.evaluationRepository.findOne({ where: { appointmentId: id } });
  }

  async remove(id: number) {
    await this.evaluationRepository.delete({ appointmentId: id });
    return { message: '评价信息删除成功' };
  }
}
