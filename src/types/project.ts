import type { User } from '@/types';

export type ProjectBase = {
  title: string;
  description: string;
  user: string[];
};

export type ProjectRecord = ProjectBase & {
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
