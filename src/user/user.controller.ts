import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from '../common/constants/auth.constants';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getUserByEmail(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Get('profileById')
  async getUserById(@Query('id') id: number) {
    return this.userService.findById(id);
  }

  @Get()
  async getUsersWithPagination(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('realName') realName?: string,
    @Query('email') email?: string,
    @Query('role') role?: Role,
  ) {
    return this.userService.getUsersWithPagination(
      page,
      limit,
      realName,
      email,
      role,
    );
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteById(+id);
  }
}
