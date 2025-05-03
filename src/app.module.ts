import { Module } from '@nestjs/common';
import { DrugModule } from './drug/drug.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DepartmentModule } from './department/department.module';
import { ConfigModule } from '@nestjs/config';
import { DoctorModule } from './doctor/doctor.module';

@Module({
  imports: [
    DrugModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1209304680',
      database: 'mini_clinic',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 生产环境应该设为false
    }),
    AuthModule,
    UserModule,
    DepartmentModule,
    DoctorModule,
  ],
})
export class AppModule {}
