import { BasePocketBaseService } from '@/services/BasePocketBaseService';
import type { NewUser, UserRecord } from '@/types';

class UserService extends BasePocketBaseService<NewUser, UserRecord> {
  constructor() {
    super('users');
  }
}

export default new UserService();
