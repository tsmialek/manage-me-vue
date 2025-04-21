import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: '1abc',
      username: 'john',
      password: 'changeme',
    },
    {
      userId: '2abc',
      username: 'maria',
      password: 'guess',
    },
  ];

  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-redundant-type-constituents
  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
