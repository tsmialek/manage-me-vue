import type {
  UserRecord,
  StoryRecord,
  KanbanPriority,
  KanbanStatus,
} from '@/types';

export type BaseTask = {
  title: string;
  description: string;
  priority: KanbanPriority;
  status: KanbanStatus;
  plannedEnd: string;
  performer?: string;
};

export type NewTask = BaseTask & {
  story: string;
};

export type TaskRecord = BaseTask & {
  id: string;
  expand: TaskRelations | null;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
  startTime?: string;
  endTime?: string;
};

export type TaskRelations = {
  performer: UserRecord;
  story: StoryRecord;
};
