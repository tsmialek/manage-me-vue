import { BasePocketBaseService } from '@/services/BasePocketBaseService';
import type { ProjectBase, ProjectRecord } from '@/types';

class ProjectService extends BasePocketBaseService<ProjectBase, ProjectRecord> {
  constructor() {
    super('projects');
  }
}

export default new ProjectService();
