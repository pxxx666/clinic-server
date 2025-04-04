import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { EmailUtil } from '../common/utils/email.util';
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  EMAIL_CODE_EXPIRES_IN,
  Role,
} from '../common/constants/auth.constants';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  private emailCodeStore: Map<string, { code: string; expiresAt: number }> =
    new Map();

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailUtil: EmailUtil,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return user;
  }
  login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: JWT_SECRET,
        expiresIn: JWT_EXPIRES_IN,
      }),
    };
  }

  async sendVerificationCode(email: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('该邮箱未注册');
    }

    const code = Math.random().toString().slice(2, 8);
    const expiresAt = Date.now() + EMAIL_CODE_EXPIRES_IN * 1000;

    this.emailCodeStore.set(email, { code, expiresAt });

    return this.emailUtil.sendVerificationCode(email, code);
  }

  verifyEmailCode(email: string, code: string): Promise<boolean> {
    const record = this.emailCodeStore.get(email);
    if (!record || record.code !== code) {
      return Promise.resolve(false);
    }

    if (Date.now() > record.expiresAt) {
      this.emailCodeStore.delete(email);
      return Promise.resolve(false);
    }

    this.emailCodeStore.delete(email);
    return Promise.resolve(true);
  }

  async register(email: string, password: string, role: Role): Promise<any> {
    if (email) {
      const existingEmail = await this.userService.findByEmail(email);
      if (existingEmail) {
        throw new UnauthorizedException('邮箱已被注册');
      }
    }

    const user = await this.userService.createUser(email, password, role);
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: JWT_SECRET,
        expiresIn: JWT_EXPIRES_IN,
      }),
    };
  }

  async loginWithEmail(email: string, code: string) {
    const isValid = await this.verifyEmailCode(email, code);
    if (!isValid) {
      throw new UnauthorizedException('验证码无效或已过期');
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: JWT_SECRET,
        expiresIn: JWT_EXPIRES_IN,
      }),
    };
  }
}
