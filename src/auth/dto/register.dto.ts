import { IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
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
}
