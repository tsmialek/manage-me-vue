import type {
  ProjectRecord,
  UserRecord,
  KanbanPriority,
  KanbanStatus,
} from '@/types';

export type BaseStory = {
  name: string;
  description: string;
  priority: KanbanPriority;
  status: KanbanStatus;
};

export type NewStory = BaseStory & {
  owner: string;
  project: string;
};

export type StoryRecord = BaseStory & {
  id: string;
  expand: StoryRelations | null;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
};

export type StoryRelations = {
  owner: UserRecord;
  project: ProjectRecord;
};
