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
import { DoctorService } from './doctor.service';
import { Doctor } from './doctor.entity';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  create(@Body() doctor: Doctor) {
    return this.doctorService.create(doctor);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('department') department?: string,
    @Query('title') title?: string,
    @Query('schedule') schedule?: string,
    @Query('auditStatus') auditStatus?: string,
    @Query('name') name?: string,
  ) {
    return this.doctorService.findAll(
      page,
      limit,
      department,
      title,
      schedule,
      auditStatus,
      name,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('id: ', id);
    return this.doctorService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() doctor: Doctor) {
    return this.doctorService.update(+id, doctor);
  }

  @Put(':id/audit')
  updateAuditStatus(@Param('id') id: string) {
    return this.doctorService.updateAuditStatus(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorService.remove(+id);
  }
}
