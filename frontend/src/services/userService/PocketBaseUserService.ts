import { BasePocketBaseService, type IUserService } from '@/services';
import type { NewUser, UserRecord } from '@/types';

class PocketBaseUserService
  extends BasePocketBaseService<NewUser, UserRecord>
  implements IUserService
{
  constructor() {
    super('users');
  }

  async getCurrentUser(): Promise<UserRecord | null> {
    try {
      return this.pb.authStore.record as UserRecord;
    } catch (error) {
      console.error(error);
      throw new Error('An error occured when getting current user info');
    }
  }

  async logIn(newUser: NewUser) {
    try {
      const authData = await this.pb
        .collection(this.collectionName)
        .authWithPassword<UserRecord>(newUser.email, newUser.password, {
          $autoCancel: false,
        });

      return authData.record;
    } catch (error) {
      console.error(error);
      throw new Error('Error occured during user login');
    }
  }

  async logOut() {
    try {
      this.pb.authStore.clear();
    } catch (error) {
      console.error(error);
      throw new Error('Error occured during user login');
    }
  }
}

export default PocketBaseUserService;
