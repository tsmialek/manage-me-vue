import type { User } from '@/types';

export type Project = {
  title: string;
  description: string;
  user: string[];
};

export type ProjectRecord = Project & {
  id: string;
  expand: ProjectRelations | null;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
};

export type ProjectRelations = {
  user: User[];
};
