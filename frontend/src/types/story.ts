import type {
  ProjectRecord,
  UserRecord,
  KanbanPriority,
  KanbanStatus,
} from '@/types';

export type BaseStory = {
  title: string;
  description: string;
  priority: KanbanPriority;
  status: KanbanStatus;
};

// TODO: use partial instead of NewStory
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
