import type { User } from '@/types';

export interface Project {
  id: string;
  title: string;
  description: string;
  user?: string;
}

export interface ProjectRecord {
  collectionId: string;
  collectionName: string;
  id: string;
  title: string;
  expand?: { user: User[] };
  description: string;
  created: Date;
  updated: Date;
  user: string[];
}
