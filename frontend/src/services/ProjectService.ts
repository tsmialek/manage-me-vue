import { BasePocketBaseService } from '@/services/BasePocketBaseService';
import type { BaseProject, ProjectRecord } from '@/types';

class ProjectService extends BasePocketBaseService<BaseProject, ProjectRecord> {
  constructor() {
    super('projects');
  }
}

export default new ProjectService();
