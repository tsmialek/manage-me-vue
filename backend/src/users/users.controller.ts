import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { User, UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get(':username')
  async getOne(
    @Param('username') username: string,
  ): Promise<Omit<User, 'password'> | undefined> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
