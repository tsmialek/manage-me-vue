import type {
  UserRecord,
  StoryRecord,
  KanbanPriority,
  KanbanStatus,
  KanbanTransition,
} from '@/types';

export type BaseTask = {
  title: string;
  description: string;
  priority: KanbanPriority;
  status: KanbanStatus;
  plannedEnd: string | null;
  performer: string | null;
};

export type NewTask = BaseTask & {
  story: string;
  status: KanbanStatus.todo;
  // TODO: can add owner or reporter
};

export type TaskRecord = BaseTask & {
  id: string;
  expand: TaskRelations | null;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
  startTime: string | null;
  endTime: string | null;
};

export type TaskRelations = {
  performer: UserRecord;
  story: StoryRecord;
};

export type TaskField = keyof TaskRecord;

export type TaskFieldsEmits = {
  (e: 'start-edit', field: TaskField): void;
  (e: 'save-edit', field: TaskField): void;
  (e: 'cancel-edit'): void;
  (e: 'update-temp-value', field: TaskField, value: string): void;
};

export type PerformerAssignmentTransition = typeof AssignPerformerTransition;
export type PerformerUnassignmentTransition =
  typeof UnassignPerformerTransition;
export type TaskResetTransition = typeof ResetToTodoTransition;
export type TaskCompletionTransition = typeof CompleteTaskTransition;
export type PerformerAssignmentForbiddenTransition =
  typeof ForbidAssignToCompletedTaskTransition;

export const AssignPerformerTransition: KanbanTransition<TaskRecord> = {
  from: 'todo' as KanbanStatus,
  to: 'doing' as KanbanStatus,
  conditions: (task, updates) =>
    task.performer === null &&
    !!updates.performer &&
    updates.performer !== 'unassigned',
  effects: (_task, updates) => ({
    ...updates,
    status: 'doing' as KanbanStatus,
    startTime: new Date().toISOString(),
  }),
};

export const ChangeFromTodoWithoutPerformer: KanbanTransition<TaskRecord> = {
  from: 'todo' as KanbanStatus,
  to: '*',
  conditions: (task, updates) =>
    task.performer === null && updates.performer === undefined,
  validationMessage:
    "You can't change status from ToDo without assigned performer",
};

export const ChangeTaskFieldsNotRelatedToStatus: KanbanTransition<TaskRecord> =
  {
    from: '*',
    to: '*',
    conditions: (_task, updates) =>
      updates.status === undefined && updates.performer === undefined,
  };

export const ChangeFromDoneToDoing: KanbanTransition<TaskRecord> = {
  from: 'done' as KanbanStatus,
  to: 'doing' as KanbanStatus,
  effects: (_task, updates) => ({
    ...updates,
    endTime: null,
  }),
};

export const UnassignPerformerTransition: KanbanTransition<TaskRecord> = {
  from: 'doing' as KanbanStatus,
  to: 'todo' as KanbanStatus,
  conditions: (_task, updates) =>
    !!updates.performer || updates.performer === 'unassigned',
  effects: (_task, updates) => ({
    ...updates,
    performer: null,
    status: 'todo' as KanbanStatus,
    startTime: null,
  }),
};

export const ResetToTodoTransition: KanbanTransition<TaskRecord> = {
  from: '*',
  to: 'todo' as KanbanStatus,
  conditions: (_task, updates) => updates.status === 'todo',
  effects: (_task, updates) => ({
    ...updates,
    performer: null,
    startTime: null,
    endTime: null,
  }),
};

export const CompleteTaskTransition: KanbanTransition<TaskRecord> = {
  from: '*',
  to: 'done' as KanbanStatus,
  conditions: (task, updates) => {
    if (updates.status === 'done') {
      if (task.status === 'todo' && !task.expand?.performer) {
        return false;
      }
      return true;
    }
    return false;
  },
  effects: (_task, updates) => ({
    ...updates,
    endTime: new Date().toISOString(),
  }),
};

export const ForbidAssignToCompletedTaskTransition: KanbanTransition<TaskRecord> =
  {
    from: 'done' as KanbanStatus,
    to: 'done' as KanbanStatus,
    conditions: (_task, updates) =>
      !!updates.performer && updates.performer !== 'unassigned',
    validationMessage: 'Cannot assign performer to completed task',
  };

export const PerformerTransitions = [
  AssignPerformerTransition,
  UnassignPerformerTransition,
  ForbidAssignToCompletedTaskTransition,
] as const;

export const StatusTransitions = [
  ResetToTodoTransition,
  CompleteTaskTransition,
  ChangeFromTodoWithoutPerformer,
  ChangeFromDoneToDoing,
] as const;

export const AllTaskTransitions = [
  ...PerformerTransitions,
  ...StatusTransitions,
  ChangeTaskFieldsNotRelatedToStatus,
] as const;
