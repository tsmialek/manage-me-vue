import type { StoryRecord, UserRecord } from '@/types';

export type BaseProject = {
  title: string;
  description: string;
  user: string[];
};

export type ProjectRecord = BaseProject & {
  id: string;
  expand: ProjectRelations | null;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
};

export type ProjectRelations = {
  user: UserRecord[];
  stories: StoryRecord[];
};
