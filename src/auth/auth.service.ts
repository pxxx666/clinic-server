import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { EmailUtil } from '../common/utils/email.util';
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  EMAIL_CODE_EXPIRES_IN,
} from '../common/constants/auth.constants';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private emailCodeStore: Map<string, { code: string; expiresAt: number }> =
    new Map();

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailUtil: EmailUtil,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userService.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return user;
  }
  login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      realName: user.realName,
    };
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

  async register(registerDto: RegisterDto) {
    const { email, password, role, phone, idCard, realName } = registerDto;

    // 检查邮箱是否已存在
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new HttpException('邮箱已被注册', HttpStatus.CONFLICT);
    }

    // 检查手机号是否已存在
    const existingPhone = await this.userService.findByPhone(phone);
    if (existingPhone) {
      throw new HttpException('手机号已被注册', HttpStatus.CONFLICT);
    }

    // 检查身份证是否已存在
    const existingIdCard = await this.userService.findByIdCard(idCard);
    if (existingIdCard) {
      throw new HttpException('身份证号已被注册', HttpStatus.CONFLICT);
    }

    // 创建用户
    const user = await this.userService.createUser(
      email,
      password,
      role,
      phone,
      idCard,
      realName,
    );

    // 生成JWT
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      userInfo: {
        email: user.email,
        role: user.role,
        realName: user.realName,
      },
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

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      realName: user.realName,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: JWT_SECRET,
        expiresIn: JWT_EXPIRES_IN,
      }),
    };
  }
}
