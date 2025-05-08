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
    const existingDrug = await this.drugRepository.findOne({
      where: { name: drug.name },
    });
    if (existingDrug) {
      return null;
    }
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
    const where: any = {};

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

  // 获取去重后的药物名称和所有种类
  async getDistinctDrugNames() {
    const drugs = await this.drugRepository.find();
    const distinctNames = [...new Set(drugs.map((drug) => drug.name))];
    return { distinctNames };
  }
  // 根据药物名称获取所有对应 ID
  async getDrugIdsByName(name: string) {
    console.log('查询药物名称:', name);
    const result = await this.drugRepository
      .createQueryBuilder('drug')
      .select('drug.id')
      .where('drug.name = :name', { name })
      .getMany();
    console.log('查询结果:', result);
    return result;
  }

  // 获取进货花费总额
  async getTotalPurchaseCost() {
    const drugs = await this.drugRepository.find();
    return drugs.reduce(
      (total, drug) => total + drug.purchasePrice * drug.purchaseQuantity,
      0,
    );
  }

  // 获取进账总额
  async getTotalProfit() {
    const drugs = await this.drugRepository.find();
    return drugs.reduce(
      (total, drug) =>
        total +
        (drug.price - drug.purchasePrice) *
          (drug.purchaseQuantity - drug.stock),
      0,
    );
  }

  // 消耗药物数量
  async consumeDrugStock(
    updates: { count: number; name: string; useMethod: string }[],
  ): Promise<any[]> {
    return Promise.all(
      updates.map(async ({ name, count }) => {
        const drug = await this.drugRepository.findOne({ where: { name } });

        if (!drug) {
          return { success: false, message: `药物 ${name} 不存在` };
        }

        if (drug.stock < count) {
          return {
            success: false,
            message: `药物  ${name} 的当前库存量为 ${drug.stock}，请求消耗数量 ${count} 不足。`,
          };
        }

        drug.stock -= count;
        const updatedDrug = await this.drugRepository.save(drug);
        return { success: true, drug: updatedDrug };
      }),
    );
  }
  // 根据名称获取药物详情
  async getDrugDetailByName(name: string) {
    return this.drugRepository.findOne({ where: { name } });
  }
}
