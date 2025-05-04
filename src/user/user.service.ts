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
  // 隐私处理函数
  private sanitizeUser(user: User): Omit<User, 'password'> | null {
    if (!user) return null;
    const { password, ...sanitizedUser } = user;
    if (sanitizedUser.phone) {
      sanitizedUser.phone = sanitizedUser.phone.replace(
        /(\d{3})\d{4}(\d{4})/,
        '$1****$2',
      );
    }
    if (sanitizedUser.idCard) {
      sanitizedUser.idCard = sanitizedUser.idCard.replace(
        /(\d{4})\d{10}(\w{4})/,
        '$1**********$2',
      );
    }
    return sanitizedUser;
  }

  // 隐私处理函数处理数组
  private sanitizeUsers(users: User[]): Omit<User, 'password'>[] {
    return users.map((user) => this.sanitizeUser(user)).filter(Boolean) as Omit<
      User,
      'password'
    >[];
  }

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

  async deleteById(id: number) {
    await this.userRepository.delete(id);
    return { message: '删除成功' };
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

  async getUsersWithPagination(
    page: number,
    limit: number,
    realName?: string,
    email?: string,
    role?: Role,
  ) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (realName) {
      queryBuilder.where('user.realName LIKE :realName', {
        realName: `%${realName}%`,
      });
    }

    if (email) {
      queryBuilder.andWhere('user.email LIKE :email', { email: `%${email}%` });
    }
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    const [users, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: this.sanitizeUsers(users),
      total,
    };
  }
}
