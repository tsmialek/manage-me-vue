import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { ref } from 'vue';

import type { ProjectRecord } from '@/types';
import { performAsyncOperation } from '@/lib/utils';
import { useStoryStore } from '@/store';
import ProjectService from '@/services/ProjectService';

export const useActiveProjectStore = defineStore('active-project', () => {
  const activeProject = ref<ProjectRecord | null>(null);
  const activeProjectId = useLocalStorage('active-project-id', '');
  const loading = ref(false);
  const error = ref(null);

  const storyStore = useStoryStore();

  const fetchActiveProject = async () => {
    if (!activeProjectId.value) return;
    const response = await performAsyncOperation(
      async () => {
        return await ProjectService.getOne(activeProjectId.value, {
          expand: 'user',
        });
      },
      loading,
      error
    );
    if (response) {
      activeProject.value = response;
      await storyStore.fetchStoriesForProject(activeProject.value.id);
    }
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
    storyStore.clearStories();
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
