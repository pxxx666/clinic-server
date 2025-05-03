import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    if (loginDto.email && loginDto.password) {
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );
      return this.authService.login(user);
    } else if (loginDto.email && loginDto.code) {
      return this.authService.loginWithEmail(loginDto.email, loginDto.code);
    } else {
      throw new UnauthorizedException('请提供用户名密码或邮箱验证码');
    }
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('send-verification-code')
  async sendVerificationCode(@Body() verifyEmailDto: VerifyEmailDto) {
    const success = await this.authService.sendVerificationCode(
      verifyEmailDto.email,
    );
    return { success };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
