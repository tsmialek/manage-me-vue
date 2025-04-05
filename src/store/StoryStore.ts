import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { NewStory, StoryRecord } from '@/types';
import { performAsyncOperation } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import { StoryService } from '@/services';

export const useStoryStore = defineStore('story', () => {
  const stories = ref<StoryRecord[]>([]);
  const error = ref(null);
  const loading = ref(false);
  const { toast } = useToast();

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

  const getStory = async (storyId: string): Promise<StoryRecord | null> => {
    const result = await performAsyncOperation(
      async () => {
        return await StoryService.getOne(storyId, {
          expand: 'owner,project',
        });
      },
      loading,
      error
    );

    return result ?? null;
  };

  const addStory = async (newStory: NewStory) => {
    if (!newStory) return;
    const result = await performAsyncOperation(
      async () => {
        return await StoryService.create(newStory);
      },
      loading,
      error
    );
    if (result) {
      toast({
        title: `Story ${result.name} created succesfully`,
      });
    }
  };

  const updateStory = async (id: string, story: any) => {
    const result = await performAsyncOperation(
      async () => {
        return await StoryService.update(id, story);
      },
      loading,
      error
    );
    if (result) {
      toast({
        title: `Story ${result.name} updated succesfully`,
      });
    }
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

  const handleRealTimeUpdates = async (action: string, record: StoryRecord) => {
    switch (action) {
      case 'create':
        const story = await getStory(record.id);
        if (story) stories.value = [...stories.value, story];
        break;
      case 'update':
        const updatedStory = await getStory(record.id);
        const index = stories.value.findIndex(s => s.id === record.id);
        if (index > -1 && updatedStory) {
          stories.value[index] = updatedStory;
        }
        break;
      case 'delete':
        stories.value = stories.value.filter(s => s.id !== record.id);
        break;
      default:
        console.warn('Unknown projects collection action');
    }
  };

  const initializeRealtimeUpdates = () => {
    StoryService.subscribe('*', handleRealTimeUpdates);
  };

  const unsubscribeFromRealtimeUpdates = () => {
    StoryService.unsubscribe();
  };

  return {
    stories,
    error,
    loading,
    getByStatus,
    fetchStoriesForProject,
    clearStories,
    addStory,
    updateStory,
    initializeRealtimeUpdates,
    unsubscribeFromRealtimeUpdates,
  };
});
