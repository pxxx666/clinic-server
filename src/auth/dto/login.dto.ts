import { IsEmail, IsString, IsOptional } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsEmail()
  email: string; // 邮箱登录方式

  @IsOptional()
  @IsString()
  password?: string; // 密码登录方式

  @IsOptional()
  @IsString()
  code?: string; // 验证码登录方式
}
