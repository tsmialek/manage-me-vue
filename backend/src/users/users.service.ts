import { Injectable } from '@nestjs/common';

export type User = {
  id: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  name: string;
  password: string;
  role: 'developer' | 'devops' | 'admin';
  avatar: string | null;
  created: string;
  updated: string;
};

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 'cn49q644j2hix6o',
      email: 'marcin@manage-me.com',
      emailVisibility: false,
      verified: true,
      name: 'msledz',
      password: 'tomeksmialek',
      role: 'developer',
      avatar: null,
      created: '2025-04-05 13:55:52 UTC',
      updated: '2025-04-05 13:55:52 UTC',
    },
    {
      id: '5azi0l7s2ca44t',
      email: 'kamil@manage-me.com',
      emailVisibility: false,
      verified: true,
      name: 'kslimak',
      password: 'tomeksmialek',
      role: 'devops',
      avatar: null,
      created: '2025-04-05 13:55:17 UTC',
      updated: '2025-04-05 13:55:17 UTC',
    },
    {
      id: '00zg5lax1dkz320',
      email: 'tomek@manage-me.com',
      emailVisibility: false,
      verified: true,
      name: 'tsmialek',
      password: 'tomeksmialek',
      role: 'admin',
      avatar: null,
      created: '2025-03-09 17:53:55 UTC',
      updated: '2025-04-05 13:54:29 UTC',
    },
  ];

  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-redundant-type-constituents
  async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
