import type { NewUser, UserRecord } from '@/types';

export type IUserService<> = {
  getAll(page: number, perPage: number): Promise<UserRecord[]>;
  getCurrentUser(): Promise<UserRecord | null>;
  logIn(newUser: NewUser): Promise<UserRecord>;
  logOut(): Promise<void>;
};
