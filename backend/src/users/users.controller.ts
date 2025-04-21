/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Controller, Get, Param } from '@nestjs/common';
import { User, UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':username')
  getOne(@Param() username: string): Promise<User | undefined> {
    return this.usersService.findOne(username);
  }
}
