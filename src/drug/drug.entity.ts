// 导入 TypeORM 相关装饰器
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

/**
 * 药物实体类，用于表示数据库中的药物信息。
 */
@Entity()
export class Drug {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 药物名称。
   */
  @Column()
  name: string;

  /**
   * 药物库存。
   */
  @Column()
  stock: number;

  /**
   * 药物售卖价格。
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  /**
   * 药物规格（剂量+单位）。
   */
  @Column()
  specification: string;

  /**
   * 药物批发价格。
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  purchasePrice: number;

  /**
   * 药物进货数量。
   */
  @Column()
  purchaseQuantity: number;

  /**
   * 药物创建时间。
   */
  @CreateDateColumn()
  createAt: Date;

  /**
   * 药物所属科室。
   */
  @Column()
  department: string;
}
