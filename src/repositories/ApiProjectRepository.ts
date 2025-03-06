import type { Project } from '@/components/projects/types';
import type { ProjectRepository } from '@/repositories/ProjectRepository';

export class ApiProjectRepository implements ProjectRepository {
  constructor(private readonly apiUrl: string) {}

  async getProjects(): Promise<Project[]> {
    throw new Error('Not implemented');
  }
}
