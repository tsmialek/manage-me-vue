import {
  type TaskRecord,
  type NewTask,
  KanbanStatus,
  KanbanTransitionManager,
  AllTaskTransitions,
} from '@/types';
import { useTaskStore } from '@/store';

export function useTaskBusinessLogic() {
  const taskStore = useTaskStore();
  const transitionManager = new KanbanTransitionManager(AllTaskTransitions);

  const updateTaskWithLogic = async (
    taskId: string,
    updates: Partial<TaskRecord>
  ) => {
    const currentTask = await taskStore.getTask(taskId);
    if (!currentTask) throw new Error('Task not found');

    const validation = transitionManager.canTransition(currentTask, updates);
    if (!validation.isValid) {
      throw new Error(validation.reason);
    }

    const finalUpdates = transitionManager.processUpdates(currentTask, updates);
    console.log('Final updates: ', finalUpdates);
    await taskStore.updateTask(taskId, finalUpdates);
  };

  const createNewTaskWithLogic = async (taskData: Omit<NewTask, 'status'>) => {
    const newTask: NewTask = {
      ...taskData,
      status: KanbanStatus.todo,
    };

    return await taskStore.addTask(newTask);
  };

  return {
    updateTaskWithLogic,
    createNewTaskWithLogic,
  };
}
