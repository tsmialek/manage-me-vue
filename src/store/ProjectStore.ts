import { defineStore } from 'pinia';
import { ref } from 'vue';

import ProjectService from '@/services/ProjectService';
import type { ProjectRecord, ProjectBase } from '@/types';
import { useToast } from '@/components/ui/toast/use-toast';
import { executeServiceOperation, showErrorToast } from '@/lib/utils';

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<ProjectRecord[]>([]);
  const error = ref(null);
  const loading = ref(false);

  const { toast } = useToast();

  const fetchProjects = async () => {
    const result = await executeServiceOperation(
      async () => {
        return await ProjectService.getAll(1, 50, { expand: 'user' });
      },
      loading,
      error
    );
    if (result) projects.value = result;
  };

  const addProject = async (newProject: ProjectBase) => {
    const result = await executeServiceOperation(
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

  const deleteProject = async (project: ProjectRecord) => {
    const result = await executeServiceOperation(
      async () => {
        return await ProjectService.delete(project.id);
      },
      loading,
      error
    );
    if (result) {
      toast({
        title: `Project ${project.title} deleted succesfully`,
      });
    }
  };

  const handleRealTimeUpdates = async (
    action: string,
    record: ProjectRecord
  ) => {
    switch (action) {
      case 'create':
        // TODO: expand record with user info
        projects.value = [...projects.value, record];
        break;
      case 'update':
        const index = projects.value.findIndex(p => p.id === record.id);
        if (index > -1) {
          projects.value[index] = record;
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
    ProjectService.subscribe(handleRealTimeUpdates);
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
    initializeRealtimeUpdates,
    unsubscribeFromRealtimeUpdates,
  };
});
