import { defineStore } from 'pinia';
import { h, ref } from 'vue';

import ProjectService from '@/services/ProjectService';
import type { ProjectRecord, ProjectBase } from '@/types';
import { useToast } from '@/components/ui/toast/use-toast';

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<ProjectRecord[]>([]);
  const error = ref(null);
  const loading = ref(false);

  const { toast } = useToast();

  const executeServiceOperation = async <T>(
    operation: () => Promise<T | undefined>
  ) => {
    try {
      loading.value = true;
      return await operation();
    } catch (e: any) {
      error.value = e.message;
      toast({
        title: 'Error',
        variant: 'destructive',
        description: error.value ?? 'Something went wrong :(',
      });
    } finally {
      loading.value = false;
    }
  };

  const fetchProjects = async () => {
    const result = await executeServiceOperation(async () => {
      return await ProjectService.getAll(1, 50, { expand: 'user' });
    });
    if (result) projects.value = result;
  };

  const addProject = async (newProject: ProjectBase) => {
    const result = await executeServiceOperation(async () => {
      return await ProjectService.create(newProject);
    });
    if (result) {
      toast({
        title: `Project ${result.title} created succesfully`,
      });
    }
  };

  const deleteProject = async (project: ProjectRecord) => {
    const result = await executeServiceOperation(async () => {
      return await ProjectService.delete(project.id);
    });
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
