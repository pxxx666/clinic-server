import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, LessThanOrEqual, Repository, Between } from 'typeorm';
import { Drug } from './drug.entity';

@Injectable()
export class DrugService {
  constructor(
    @InjectRepository(Drug) private drugRepository: Repository<Drug>,
  ) {}

  // 创建药物
  async createDrug(drug: Drug) {
    return this.drugRepository.save(drug);
  }

  // 获取所有药物

  async getAllDrugs(
    page: number = 1,
    limit: number = 10,
    name?: string,
    department?: string,
    startDate?: string, // "2025-05-02 00:00:00"
    endDate?: string, // "2025-05-04 00:00:00"
  ) {
    const skip = (page - 1) * limit;
    const where = {};

    if (name) where.name = name;
    if (department) where.department = department;

    if (startDate || endDate) {
      // 转换成 Date 对象
      const startDateObj = startDate ? new Date(startDate) : undefined;
      const endDateObj = endDate ? new Date(endDate) : undefined;

      if (startDateObj && endDateObj) {
        // 同时有 startDate 和 endDate，使用 Between
        where.createAt = Between(startDateObj, endDateObj);
      } else if (startDateObj) {
        // 只有 startDate
        where.createAt = MoreThanOrEqual(startDateObj);
      } else if (endDateObj) {
        // 只有 endDate
        where.createAt = LessThanOrEqual(endDateObj);
      }
    }

    const [drugs, total] = await this.drugRepository.findAndCount({
      where,
      skip,
      take: limit,
    });
    return { data: drugs, total };
  }

  // 根据 ID 获取药物
  async getDrugById(id: number) {
    return this.drugRepository.findOne({ where: { id } });
  }

  // 更新药物信息
  async updateDrug(id: number, drug: Drug) {
    await this.drugRepository.update(id, drug);
    return this.drugRepository.findOne({ where: { id } });
  }

  // 删除药物
  async deleteDrug(id: number) {
    await this.drugRepository.delete(id);
  }
}
