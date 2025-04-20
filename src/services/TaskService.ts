import { BasePocketBaseService } from '@/services';

import type { NewTask, TaskRecord } from '@/types';

class TaskService extends BasePocketBaseService<NewTask, TaskRecord> {
  constructor() {
    super('tasks');
  }
}

export default new TaskService();
