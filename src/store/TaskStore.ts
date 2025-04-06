import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { NewTask, TaskRecord } from '@/types';
import { performAsyncOperation } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import { TaskService } from '@/services';

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<TaskRecord[]>([]);
  const error = ref(null);
  const loading = ref(false);
  const { toast } = useToast();

  const fetchTasksForStory = async (storyId: string) => {
    if (!storyId) return;
    const result = await performAsyncOperation(
      async () =>
        await TaskService.getAll(1, 50, {
          expand: 'performer,story',
          filter: `story = "${storyId}"`,
        }),
      loading,
      error
    );
    if (result) tasks.value = result;
  };

  const getTask = async (storyId: string): Promise<TaskRecord | null> => {
    const result = await performAsyncOperation(
      async () => {
        return await TaskService.getOne(storyId, {
          expand: 'performer,story',
        });
      },
      loading,
      error
    );

    return result ?? null;
  };

  const addTask = async (newTask: NewTask) => {
    if (!newTask) return;
    const result = await performAsyncOperation(
      async () => {
        return await TaskService.create(newTask);
      },
      loading,
      error
    );
    if (result) {
      toast({
        title: `Task ${result.name} created successfully`,
      });
    }
  };

  const updateTask = async (id: string, story: any) => {
    const result = await performAsyncOperation(
      async () => {
        return await TaskService.update(id, story);
      },
      loading,
      error
    );
    if (result) {
      toast({
        title: `Task ${result.name} updated successfully`,
      });
    }
  };

  const getByStatus = computed(() => {
    const result: Record<string, TaskRecord[]> = {
      todo: [],
      doing: [],
      done: [],
    };

    tasks.value.forEach(task => {
      result[task.status].push(task);
    });

    return result;
  });

  const clearTasks = () => {
    tasks.value = [];
  };

  const handleRealTimeUpdates = async (action: string, record: TaskRecord) => {
    switch (action) {
      case 'create':
        const task = await getTask(record.id);
        if (task) tasks.value = [...tasks.value, task];
        break;
      case 'update':
        const updatedTask = await getTask(record.id);
        const index = tasks.value.findIndex(s => s.id === record.id);
        if (index > -1 && updatedTask) {
          tasks.value[index] = updatedTask;
        }
        break;
      case 'delete':
        tasks.value = tasks.value.filter(s => s.id !== record.id);
        break;
      default:
        console.warn('Unknown tasks collection action');
    }
  };

  const initializeRealtimeUpdates = () => {
    TaskService.subscribe('*', handleRealTimeUpdates);
  };

  const unsubscribeFromRealtimeUpdates = () => {
    TaskService.unsubscribe();
  };

  return {
    tasks,
    error,
    loading,
    getByStatus,
    fetchTasksForStory,
    clearTasks,
    addTask,
    updateTask,
    initializeRealtimeUpdates,
    unsubscribeFromRealtimeUpdates,
  };
});
