import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

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
}
