import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { EmailUtil } from '../common/utils/email.util';
import { DrugModule } from '../drug/drug.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), DrugModule],
  controllers: [AppointmentController],
  providers: [AppointmentService, EmailUtil],
  exports: [AppointmentService, TypeOrmModule.forFeature([Appointment])], // 确保这里导出服务
})
export class AppointmentModule {}
