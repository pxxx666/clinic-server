import {
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsString,
  IsPhoneNumber,
  Length,
  Matches,
} from 'class-validator';
import { Role } from '../../common/constants/auth.constants';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string; // 替代username

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @Length(18, 18)
  @Matches(/^\d{17}[\dXx]$/, {
    message: '身份证号格式不正确',
  })
  @IsNotEmpty()
  idCard: string;

  @IsNotEmpty()
  realName: string; // 姓名
}
