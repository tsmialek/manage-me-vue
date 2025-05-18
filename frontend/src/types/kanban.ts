export enum KanbanPriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export enum KanbanStatus {
  todo = 'todo',
  doing = 'doing',
  done = 'done',
}

// TODO: check if this is correct
export type KanbanItem = {
  id: string;
  status: KanbanStatus;
};
