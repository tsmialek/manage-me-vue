import type { Project } from '@/components/projects/types';
import type { ProjectRepository } from '@/repositories/ProjectRepository';

export class JsonProjectRepository implements ProjectRepository {
  constructor(private jsonPath: string) {}

  async getProjects(): Promise<Project[]> {
    const response = await fetch(this.jsonPath);

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    return await response.json();
  }
}
