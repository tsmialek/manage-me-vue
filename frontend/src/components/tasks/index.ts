import type { UserRole } from '@/types';

export { default as TaskForm } from './task-form.vue';
export { default as TaskDetailsSidebar } from './TaskDetailsSidebar.vue';
export { default as TaskTitleCard } from './TaskTitleCard.vue';
export { default as TaskDescriptionCard } from './TaskDescriptionCard.vue';
export { default as TaskTimelineCard } from './TaskTimelineCard.vue';
export { default as TaskAdditionalInfoCard } from './TaskAdditionalInfoCard.vue';

export const AVAILABLE_PERFORMER_ROLES: UserRole[] = ['developer', 'devops'];
