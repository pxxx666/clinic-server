// 导入 TypeORM 相关装饰器
import { Entity, Column } from 'typeorm';
import { PrimaryColumn } from 'typeorm';

/**
 * 医生实体类，用于表示数据库中的医生信息。
 */
@Entity()
export class Doctor {
  @PrimaryColumn()
  id: number;

  /**
   * 医生的姓名。
   */
  @Column()
  name: string;

  /**
   * 医生的性别。
   */
  @Column()
  gender: string;

  /**
   * 医生的职称。
   */
  @Column()
  title: string;

  /**
   * 医生所属的科室。
   */
  @Column()
  department: string;

  /**
   * 医生的专业领域。
   */
  @Column()
  expertise: string;

  /**
   * 医生的工作年限。
   */
  @Column()
  workingYears: number;

  /**
   * 医生的联系电话。
   */
  @Column()
  phone: string;

  /**
   * 医生的电子邮箱。
   */
  @Column()
  email: string;

  /**
   * 医生信息的审核状态。
   */
  @Column({ default: '0' })
  auditStatus: string;

  /**
   * 医生的职业资格证书。
   */
  @Column('text', { nullable: true })
  introduction: string;

  /**
   * 医生的教育背景，数组形式，默认第一个是学士学校，第二个是硕士，第三个是博士。
   */
  @Column('simple-array', { nullable: true })
  education: string[];

  /**
   * 医生的执业证书信息。
   */
  @Column('simple-array', { nullable: true })
  certificate: string[];

  /**
   * 医生的排班信息。
   */
  @Column('simple-array', { nullable: true })
  schedule: string[];
}
