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
import { DrugService } from './drug.service';
import { Drug } from './drug.entity';

@Controller('drugs')
export class DrugController {
  constructor(private readonly drugService: DrugService) {}

  // 创建药物
  @Post()
  async createDrug(@Body() drug: Drug): Promise<Drug> {
    return this.drugService.createDrug(drug);
  }

  // 获取所有药物
  @Get()
  async getAllDrugs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('name') name?: string,
    @Query('department') department?: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ): Promise<{ data: Drug[]; total: number }> {
    console.log('1212');

    return this.drugService.getAllDrugs(
      page,
      limit,
      name,
      department,
      start,
      end,
    );
  }

  // 根据 ID 获取药物
  @Get(':id')
  async getDrugById(@Param('id') id: number): Promise<Drug | null> {
    return this.drugService.getDrugById(id);
  }

  // 更新药物信息
  @Put(':id')
  async updateDrug(
    @Param('id') id: number,
    @Body() drug: Drug,
  ): Promise<Drug | null> {
    return this.drugService.updateDrug(id, drug);
  }

  // 删除药物
  @Delete(':id')
  async deleteDrug(@Param('id') id: number): Promise<void> {
    return this.drugService.deleteDrug(id);
  }

  // 获取去重后的药物名称和所有种类
  @Get('/distinct/name')
  async getDistinctDrugNames() {
    return this.drugService.getDistinctDrugNames();
  }

  // 获取进货花费总额
  @Get('/total/purchase-cost')
  async getTotalPurchaseCost() {
    return this.drugService.getTotalPurchaseCost();
  }

  // 获取进账总额
  @Get('/total/profit')
  async getTotalProfit() {
    return this.drugService.getTotalProfit();
  }
}
