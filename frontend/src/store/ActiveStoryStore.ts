import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { ref } from 'vue';

import type { StoryRecord } from '@/types';
import { performAsyncOperation } from '@/lib/utils';
import { useTaskStore } from '@/store';
import StoryService from '@/services/StoryService';

export const useActiveStoryStore = defineStore('active-story', () => {
  const activeStory = ref<StoryRecord | null>(null);
  const activeStoryId = useLocalStorage('active-story-id', '');
  const loading = ref(false);
  const error = ref(null);

  const taskStore = useTaskStore();

  const fetchActiveStory = async () => {
    if (!activeStoryId.value) return;
    const response = await performAsyncOperation(
      async () => {
        return await StoryService.getOne(activeStoryId.value, {
          expand: 'owner',
        });
      },
      loading,
      error
    );
    if (response) {
      activeStory.value = response;
      await taskStore.fetchTasksForStory(activeStory.value.id);
    }
  };

  const setActiveStory = async (storyId: string) => {
    activeStoryId.value = storyId;
    await fetchActiveStory();
  };

  const clearActiveStory = () => {
    activeStory.value = null;
    activeStoryId.value = '';
    error.value = null;
    loading.value = false;
    taskStore.clearTasks();
  };

  return {
    activeStory,
    activeStoryId,
    loading,
    error,
    clearActiveStory,
    setActiveStory,
  };
});
