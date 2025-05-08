import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
/**
 * 预约实体类，用于表示数据库中的预约信息。
 */
export class Appointment {
  /**
   * 预约记录的唯一标识 ID。
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 发起预约的用户 ID。
   */
  @Column()
  userId: string;

  /**
   * 患者姓名。
   */
  @Column()
  patientName: string;

  /**
   * 患者的电子邮箱。
   */
  @Column()
  patientEmail: string;

  /**
   * 负责预约的医生 ID。
   */
  @Column()
  doctorId: string;

  /**
   * 医生姓名。
   */
  @Column()
  doctorName: string;

  /**
   * 医生职称（此处存在拼写错误，正确应为 doctorTitle）。
   */
  @Column()
  doctorTitle: string;

  /**
   * 预约所属科室。
   */
  @Column()
  department: string;

  /**
   * 预约时间。
   */
  @Column()
  appointmentTime: string;

  /**
   * 患者对自身病情的描述。
   */
  @Column()
  patientDescription: string;

  /**
   * 医生的诊断结果，可为空。
   */
  @Column({ nullable: true })
  diagnosticResult: string;

  /**
   * 医生开具的药物信息，以 JSON 格式存储，可为空。
   */
  @Column('simple-json', { nullable: true })
  drug: { name: string; count: number; useMethod: string }[];

  /**
   * 医生给出的建议，可为空。
   */
  @Column({ nullable: true })
  doctorAdvice: string;

  /**
   * 预约状态，创建时默认待叫号，更新后变已结束。
   */
  @Column({
    type: 'enum',
    enum: ['待叫号', '就诊中', '已结束'],
    default: '待叫号',
  })
  status: '待叫号' | '就诊中' | '已结束';
}
