<script setup lang="ts">
import router from '@/router';
import { useRoute } from 'vue-router';
import { onMounted, onUnmounted, watch } from 'vue';

import { Badge } from '@/components/ui/badge';

import { KanbanPageLayout } from '@/pages/layouts';
import { KanbanBoard } from '@/components/kanban';
import { TaskForm } from '@/components/tasks';

import {
  useAppStore,
  useActiveStoryStore,
  useTaskStore,
  useActiveTaskStore,
  useActiveProjectStore,
} from '@/store';
import type { TaskRecord } from '@/types';

const activeStoryStore = useActiveStoryStore();
const appStore = useAppStore();
const taskStore = useTaskStore();
const activeTaskStore = useActiveTaskStore();
const activeProjectStore = useActiveProjectStore(); // Assuming this is the correct store for active project
const route = useRoute();

const showCreateTaskPage = () => {
  appStore.openModal('create-task', TaskForm, 'Create Task', {}, false);
};

const handleTaskSelection = async (payload: TaskRecord) => {
  console.log('Task selected:', payload);
  activeTaskStore.setActiveTask(payload.id);
  router.push(
    `/project/${activeProjectStore.activeProjectId}/${activeStoryStore.activeStoryId}/${payload.id}`
  );
};

const handleTaskDelete = async (payload: TaskRecord) => {
  taskStore.deleteTask(payload.id);
};

watch(
  () => route.params.storyId,
  async newId => {
    activeStoryStore.clearActiveStory();
    newId = Array.isArray(newId) ? newId[0] : newId;
    await activeStoryStore.setActiveStory(newId);
  },
  { immediate: true }
);

onMounted(async () => {
  taskStore.initializeRealtimeUpdates();
});

onUnmounted(async () => {
  taskStore.unsubscribeFromRealtimeUpdates();
});
</script>

<template>
  <KanbanPageLayout
    add-button-label="Create Task"
    separator-label="tasks"
    :title="`Story: ${activeStoryStore.activeStory?.title ?? ''}`"
    :description="activeStoryStore.activeStory?.description ?? ''"
    :error="activeStoryStore.error"
    @add="showCreateTaskPage"
  >
    <KanbanBoard
      :items="taskStore.tasks"
      @item-select="handleTaskSelection"
      @item-edit="handleTaskSelection"
      @item-delete="handleTaskDelete"
    >
      <template #item-name="{ item }">{{ item.title }}</template>
      <template #item-description="{ item }">{{ item.description }}</template>
      <template #item-badges="{ item }">
        <Badge variant="secondary">Priority: {{ item.priority }}</Badge>
        <Badge :variant="item.expand?.performer ? 'secondary' : 'destructive'">
          Performer: {{ item.expand?.performer?.name ?? 'Unassigned' }}
        </Badge>
      </template>
    </KanbanBoard>
  </KanbanPageLayout>
</template>

<style></style>
