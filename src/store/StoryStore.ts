import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { StoryRecord } from '@/types';
import { performAsyncOperation } from '@/lib/utils';
import { StoryService } from '@/services';

export const useStoryStore = defineStore('story', () => {
  const stories = ref<StoryRecord[]>([]);
  const error = ref(null);
  const loading = ref(false);

  const fetchStoriesForProject = async (projectId: string) => {
    if (!projectId) return;
    const result = await performAsyncOperation(
      async () =>
        await StoryService.getAll(1, 50, {
          expand: 'owner,project',
          filter: `project = "${projectId}"`,
        }),
      loading,
      error
    );
    if (result) stories.value = result;
  };

  const getByStatus = computed(() => {
    const result: Record<string, StoryRecord[]> = {
      todo: [],
      doing: [],
      done: [],
    };

    stories.value.forEach(story => {
      result[story.status].push(story);
    });

    return result;
  });

  const clearStories = () => {
    stories.value = [];
  };

  return {
    stories,
    error,
    loading,
    getByStatus,
    fetchStoriesForProject,
    clearStories,
  };
});
