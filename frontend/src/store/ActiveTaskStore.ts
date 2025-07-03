import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { TaskRecord } from '@/types';
import { useLocalStorage } from '@vueuse/core';
import { useTaskStore } from '@/store';

export const useActiveTaskStore = defineStore('active-task', () => {
  const activeTask = ref<TaskRecord | null>(null);
  const activeTaskId = useLocalStorage('active-task-id', '');

  const taskStore = useTaskStore();

  const fetchActiveTask = async () => {
    if (!activeTaskId.value) return;
    const task = await taskStore.getTask(activeTaskId.value);
    if (task) {
      activeTask.value = task;
    }
  };

  const setActiveTask = async (taskId: string) => {
    activeTaskId.value = taskId;
    await fetchActiveTask();
  };

  const clearActiveTask = async () => {
    activeTask.value = null;
    activeTaskId.value = '';
  };

  return {
    activeTask,
    activeTaskId,
    setActiveTask,
    clearActiveTask,
  };
});
