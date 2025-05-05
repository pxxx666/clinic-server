import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './doctor.entity';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { AppointmentModule } from '../appointment/appointment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor]), AppointmentModule],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
