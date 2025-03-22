import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { ProjectRecord } from '@/types';
import { performAsyncOperation } from '@/lib/utils';
import ProjectService from '@/services/ProjectService';

export const useActiveProjectStore = defineStore('active-project', () => {
  const activeProject = ref<ProjectRecord | null>(null);
  const activeProjectId = ref('');
  const loading = ref(false);
  const error = ref(null);

  const fetchActiveProject = async () => {
    if (!activeProjectId.value) return;
    performAsyncOperation(
      async () => {
        return await ProjectService.getOne(`id="${activeProjectId.value}"`, {
          expand: 'user',
        });
      },
      loading,
      error
    );
  };

  const setActiveProject = async (projectId: string) => {
    activeProjectId.value = projectId;
    await fetchActiveProject();
  };

  const clearActiveProject = () => {
    activeProject.value = null;
    activeProjectId.value = '';
    error.value = null;
    loading.value = false;
  };

  return {
    activeProject,
    activeProjectId,
    loading,
    error,
    clearActiveProject,
    setActiveProject,
  };
});
