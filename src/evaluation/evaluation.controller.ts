import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { Evaluation } from './evaluation.entity';

@Controller('evaluations')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Get('/appointment/:appointmentId')
  async getEvaluation(@Param('appointmentId') appointmentId: number) {
    console.log('appointmentId: ', appointmentId);

    return this.evaluationService.getEvaluationByAppointmentId(appointmentId);
  }

  @Post()
  create(@Body() evaluation: Omit<Evaluation, 'id'>) {
    return this.evaluationService.create(evaluation);
  }

  @Get()
  findAll() {
    return this.evaluationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evaluationService.findOne(+id);
  }

  @Get('doctor/:doctorId')
  findByDoctorId(@Param('doctorId') doctorId: string) {
    return this.evaluationService.findByDoctorId(+doctorId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<Evaluation>) {
    return this.evaluationService.update(+id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.evaluationService.remove(+id);
  }
}
