import { defineStore } from 'pinia';
import { ref } from 'vue';

import ProjectService from '@/services/ProjectService';
import type { ProjectRecord, BaseProject } from '@/types';
import { useToast } from '@/components/ui/toast/use-toast';
import { performAsyncOperation } from '@/lib/utils';

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<ProjectRecord[]>([]);
  const error = ref(null);
  const loading = ref(false);

  const { toast } = useToast();

  const fetchProjects = async () => {
    const result = await performAsyncOperation(
      async () => {
        return await ProjectService.getAll(1, 50, { expand: 'user' });
      },
      loading,
      error
    );
    if (result) projects.value = result;
  };

  const getProject = async (
    projectId: string
  ): Promise<ProjectRecord | null> => {
    const result = await performAsyncOperation(
      async () => {
        return await ProjectService.getOne(projectId, {
          expand: 'user',
        });
      },
      loading,
      error
    );

    return result ?? null;
  };

  const addProject = async (newProject: BaseProject) => {
    if (!newProject) return;
    const result = await performAsyncOperation(
      async () => {
        return await ProjectService.create(newProject);
      },
      loading,
      error
    );
    if (result) {
      toast({
        title: `Project ${result.title} created succesfully`,
      });
    }
  };

  const updateProject = async (id: string, project: any) => {
    const result = await performAsyncOperation(
      async () => {
        return await ProjectService.update(id, project);
      },
      loading,
      error
    );
    if (result) {
      toast({
        title: `Project ${result.title} updated successfully`,
      });
    }
  };
  const deleteProject = async (project: ProjectRecord) => {
    const result = await performAsyncOperation(
      async () => {
        return await ProjectService.delete(project.id);
      },
      loading,
      error
    );
    if (result) {
      toast({
        title: `Project ${project.title} deleted successfully`,
      });
    }
  };

  const handleRealTimeUpdates = async (
    action: string,
    record: ProjectRecord
  ) => {
    switch (action) {
      case 'create':
        const project = await getProject(record.id);
        if (project) projects.value = [...projects.value, project];
        break;
      case 'update':
        const updatedProject = await getProject(record.id);
        const index = projects.value.findIndex(p => p.id === record.id);
        if (index > -1 && updatedProject) {
          // TODO: this if not efficient. Implemented only as temporary solution.
          const updatedProjects = [...projects.value];
          updatedProjects[index] = updatedProject;
          projects.value = updatedProjects;
        }
        break;
      case 'delete':
        projects.value = projects.value.filter(p => p.id !== record.id);
        break;
      default:
        console.warn('Unknown projects collection action');
    }
  };

  const initializeRealtimeUpdates = () => {
    ProjectService.subscribe('*', handleRealTimeUpdates);
  };

  const unsubscribeFromRealtimeUpdates = () => {
    ProjectService.unsubscribe();
  };

  return {
    projects,
    error,
    loading,
    fetchProjects,
    deleteProject,
    addProject,
    updateProject,
    initializeRealtimeUpdates,
    unsubscribeFromRealtimeUpdates,
  };
});
