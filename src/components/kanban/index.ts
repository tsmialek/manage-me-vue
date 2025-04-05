export { default as KanbanCard } from './kanban-card.vue';
export { default as KanbanItem } from './kanban-item.vue';

export const variants = {
  todo: 'bg-gray-50 dark:bg-gray-800/30',
  doing: 'bg-amber-50 dark:bg-amber-900/30',
  done: 'bg-emerald-50 dark:bg-emerald-900/30',
};

export type kanbanVariant = 'todo' | 'doing' | 'done';
