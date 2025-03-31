import type { ProjectRecord, UserRecord } from '@/types';

export type BaseStory = {
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'doing' | 'done';
};

export type NewStory = BaseStory & {
  user: string;
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
  user: UserRecord;
  project: ProjectRecord;
};
