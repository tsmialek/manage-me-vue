import type { Project, ProjectRecord } from '@/types';
import { BadRequest, ServerError } from '@/types';
import PocketBase from 'pocketbase';

class ProjectsService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
  }

  async getProjects() {
    try {
      const projectsRecords = await this.pb
        .collection('projects')
        .getList<ProjectRecord>(1, 50, { expand: 'user' });

      return projectsRecords.items;
    } catch (error) {
      console.error(error);
      throw new Error('An error occured when getting projects info.');
    }
  }

  // tutaj powinna być logika create, update, delete, a nie w store. Store powinien wywoływać tą metodę z 3 funkcjami / parametrami
  subscribeToProjects(
    callback: (action: string, record: ProjectRecord) => void
  ) {
    this.pb
      .collection('projects')
      .subscribe('*', (e: { action: string; record: ProjectRecord }) => {
        callback(e.action, e.record as ProjectRecord);
      });
  }

  async deleteProject(id: string) {
    try {
      const success = await this.pb.collection('projects').delete(id);

      return success;
    } catch (error: any) {
      console.warn(error);
      if (error.status >= 500) throw new ServerError();
      if (error.status >= 400) throw new BadRequest();
      else throw new Error('An error occured when deleting project');
    }
  }

  async createProject(project: Project) {
    try {
      const projectPostRequest = await this.pb
        .collection('projects')
        .create<ProjectRecord>(project);

      return projectPostRequest;
    } catch (error) {
      throw new Error('An error occured when creating project.');
    }
  }
}

export default new ProjectsService();
