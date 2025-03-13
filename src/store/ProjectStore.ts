import { defineStore } from 'pinia';
import { ref } from 'vue';

import ProjectService from '@/services/ProjectsService';
import type { ProjectRecord } from '@/types';

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<ProjectRecord[]>([]);
  const error = ref(null);
  const loading = ref(false);

  const fetchProjects = async () => {
    try {
      loading.value = true;
      projects.value = await ProjectService.getProjects();
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      loading.value = true;
      return await ProjectService.deleteProject(id);
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const handleRealTimeUpdates = async (
    action: string,
    record: ProjectRecord
  ) => {
    switch (action) {
      case 'create':
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

  return {
    projects,
    error,
    loading,
    fetchProjects,
    deleteProject,
    handleRealTimeUpdates,
  };
});
