import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drug } from './drug.entity';
import { DrugService } from './drug.service';
import { DrugController } from './drug.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Drug])],
  providers: [DrugService],
  controllers: [DrugController],
  exports: [DrugService, TypeOrmModule.forFeature([Drug])],
})
export class DrugModule {}
