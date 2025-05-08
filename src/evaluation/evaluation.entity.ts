import { Entity, Column } from 'typeorm';

@Entity()
export class Evaluation {
  @Column({ primary: true })
  appointmentId: number;

  @Column()
  patientId: string;

  @Column()
  patientName: string;

  @Column()
  doctorId: string;

  @Column()
  doctorName: string;

  @Column()
  ProfessionalMark: number;

  @Column()
  CommunicationMark: number;

  @Column()
  ServiceMark: number;

  @Column()
  EfficiencyMark: number;

  @Column()
  EthicsMark: number;

  @Column('simple-array')
  tags: string[];

  @Column()
  remark: string;

  @Column({ type: 'date' })
  evaluationDate: Date;
}
