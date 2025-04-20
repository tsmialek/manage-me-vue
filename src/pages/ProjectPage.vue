<script setup lang="ts">
import router from '@/router';
import { useRoute } from 'vue-router';
import { onMounted, onUnmounted, watch } from 'vue';

import { StoryForm } from '@/components/stories';
import { KanbanPageLayout } from '@/pages/layouts';
import { KanbanBoard } from '@/components/kanban';

import {
  useActiveProjectStore,
  useAppStore,
  useStoryStore,
  useActiveStoryStore,
} from '@/store';
import type { KanbanItem } from '@/types';

const activeProjectStore = useActiveProjectStore();
const storyStore = useStoryStore();
const activeStoryStore = useActiveStoryStore();
const appStore = useAppStore();
const route = useRoute();

const showCreateStoryPage = () => {
  appStore.openModal('create-story', StoryForm, 'Create Story');
};

const handleStorySelection = async (payload: KanbanItem) => {
  activeStoryStore.setActiveStory(payload.id);
  const projectId = activeProjectStore.activeProjectId;
  router.push(`/project/${projectId}/${payload.id}`);
};

const handleStoryEdit = async (payload: KanbanItem) => {
  const story = await storyStore.getStory(payload.id);
  appStore.openModal('edit-story', StoryForm, 'Edit Story', { story: story });
};

const handleStoryDelete = async (story: KanbanItem) => {
  await storyStore.deleteStory(story.id);
};

watch(
  () => route.params.projectId,
  async newId => {
    activeProjectStore.clearActiveProject();
    newId = Array.isArray(newId) ? newId[0] : newId;
    await activeProjectStore.setActiveProject(newId);
  },
  { immediate: true }
);

onMounted(async () => {
  storyStore.initializeRealtimeUpdates();
});

onUnmounted(async () => {
  storyStore.unsubscribeFromRealtimeUpdates();
});
</script>

<template>
  <KanbanPageLayout
    add-button-label="Add story"
    separator-label="stories"
    :title="`Project: ${activeProjectStore.activeProject?.title ?? ''}`"
    :description="activeProjectStore.activeProject?.description ?? ''"
    :error="activeProjectStore.error"
    @add="showCreateStoryPage"
  >
    <KanbanBoard
      :items="storyStore.stories"
      @item-click="handleStorySelection"
      @item-edit="handleStoryEdit"
      @item-delete="handleStoryDelete"
    ></KanbanBoard>
  </KanbanPageLayout>
</template>

<style></style>
