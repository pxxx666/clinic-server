import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Role } from '../common/constants/auth.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByIdCard(idCard: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { idCard } });
  }

  async createUser(
    email: string,
    password: string,
    role: Role,
    phone: string,
    idCard: string,
    realName: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role,
      phone,
      idCard,
      realName,
    });

    return this.userRepository.save(user);
  }
  async updateUserProfile(
    userId: number,
    updates: { phone?: string; realName?: string; idCard?: string },
  ): Promise<User | null> {
    await this.userRepository.update(userId, updates);
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
