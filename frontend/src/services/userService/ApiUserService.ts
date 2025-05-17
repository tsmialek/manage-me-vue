import { type IUserService } from '@/services';
import type { NewUser, UserRecord } from '@/types';

class ApiUserService implements IUserService {
  async getAll(): Promise<UserRecord[]> {
    throw new Error('Method not implemented.');
  }
  async getCurrentUser(): Promise<UserRecord | null> {
    throw new Error('Method not implemented.');
  }
  async logIn(newUser: NewUser): Promise<UserRecord> {
    throw new Error('Method not implemented.');
  }
  async logOut(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export default ApiUserService;
