import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.entity';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(
    @Body()
    appointment: Omit<
      Appointment,
      'diagnosticResult' | 'drug' | 'doctorAdvice'
    >,
  ) {
    return this.appointmentService.create(appointment);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('userId') userId?: string,
    @Query('doctorId') doctorId?: string,
    @Query('department') department?: string,
    @Query('appointmentTime') appointmentTime?: string,
  ) {
    return this.appointmentService.findAll(
      page,
      limit,
      userId,
      doctorId,
      department,
      appointmentTime,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateData: Pick<Appointment, 'diagnosticResult' | 'drug' | 'doctorAdvice'>,
  ) {
    return this.appointmentService.update(+id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }
}
