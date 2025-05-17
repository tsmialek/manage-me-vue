import {
  ApiUserService,
  PocketBaseUserService,
  type IUserService,
} from '@/services';
import type { UserRecord, NewUser } from '@/types';

class UserService implements IUserService {
  private service: IUserService;
  constructor() {
    this.service = UserServiceFactory.createUserService();
  }
  getAll(page: number = 1, perPage: number = 50): Promise<UserRecord[]> {
    return this.service.getAll(page, perPage);
  }
  getCurrentUser(): Promise<UserRecord | null> {
    return this.service.getCurrentUser();
  }
  logIn(newUser: NewUser): Promise<UserRecord> {
    return this.service.logIn(newUser);
  }
  logOut(): Promise<void> {
    return this.service.logOut();
  }
}

enum UserServiceProvider {
  custom = 'custom',
  pocketbase = 'pocketbase',
}

class UserServiceFactory {
  static createUserService(): IUserService {
    const provider =
      (import.meta.env.AUTH_SERVICE_TYPE as UserServiceProvider) ||
      UserServiceProvider.pocketbase;

    switch (provider) {
      case UserServiceProvider.pocketbase:
        return new PocketBaseUserService();
      case UserServiceProvider.custom:
        return new ApiUserService();
      default:
        return new PocketBaseUserService();
    }
  }
}

export default new UserService();
