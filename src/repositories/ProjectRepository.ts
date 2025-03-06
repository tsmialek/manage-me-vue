import type { Project } from '@/components/projects/types';

export interface ProjectRepository {
  getProjects(): Promise<Project[]>;
}
