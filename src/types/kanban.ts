export enum KanbanPriority {
  low,
  medium,
  high,
}

export enum KanbanStatus {
  todo,
  doing,
  done,
}

// TODO: check if this is correct
export type KanbanItem<TExpand = unknown> = {
  status: KanbanStatus;
  priority: KanbanPriority;
  name: string;
  description: string;
  expand?: TExpand;
};
