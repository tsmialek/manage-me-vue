<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, onUnmounted, watch } from 'vue';

import { KanbanPageLayout } from '@/pages/layouts';
import { KanbanBoard } from '@/components/kanban';

import { useAppStore, useActiveStoryStore, useTaskStore } from '@/store';
import type { KanbanItem } from '@/types';

const activeStoryStore = useActiveStoryStore();
const appStore = useAppStore();
const taskStore = useTaskStore();
const route = useRoute();

const showCreateTaskPage = () => {
  // appStore.openModal('create-task', TaskForm, 'Create Task');
  throw new Error('not implemented yet');
};

const handleTaskSelection = async (payload: KanbanItem) => {
  throw new Error('not implemented yet');
};

const handleTaskEdit = async (payload: KanbanItem) => {
  throw new Error('not implemented yet');
};

const handleTaskDelete = async (payload: KanbanItem) => {
  throw new Error('not implemented yet');
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
      @item-click="handleTaskSelection"
      @item-edit="handleTaskEdit"
      @item-delete="handleTaskDelete"
    ></KanbanBoard>
  </KanbanPageLayout>
</template>

<style></style>
