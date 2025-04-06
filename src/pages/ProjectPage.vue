<script setup lang="ts">
import router from '@/router';
import { useRoute } from 'vue-router';
import { onMounted, onUnmounted, watch } from 'vue';

import { StoryForm } from '@/components/stories';
import { PlusIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { KanbanCard, KanbanListItem } from '@/components/kanban';
import { Separator } from '@/components/ui/separator';

import {
  useActiveProjectStore,
  useAppStore,
  useStoryStore,
  useActiveStoryStore,
} from '@/store';

const activeProjectStore = useActiveProjectStore();
const storyStore = useStoryStore();
const activeStoryStore = useActiveStoryStore();
const appStore = useAppStore();
const route = useRoute();

const handleBackToDashboard = async () => {
  activeProjectStore.clearActiveProject();
  router.push({ name: 'Dashboard' });
};

const showCreateStoryPage = () => {
  appStore.openModal('create-story', StoryForm, 'Create Story');
};

const handleStorySelection = async (storyId: string) => {
  activeStoryStore.setActiveStory(storyId);
  const projectId = activeProjectStore.activeProjectId;
  router.push(`/project/${projectId}/${storyId}`);
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
  <div class="relative">
    <div v-if="activeProjectStore.activeProject" class="p-4 space-y-4">
      <Card class="grid grid-cols-[1fr_auto] p-4">
        <h1 class="text-2xl font-semibold justify-self-center">
          {{ activeProjectStore.activeProject.title }}
        </h1>
        <Button @click="handleBackToDashboard" class="justify-self-end">
          Back
        </Button>
      </Card>
      <Card class="p-4 space-y-4">
        <CardHeader class="space-y-2 p-2">
          <p><Badge>description:</Badge></p>
          <CardTitle>
            {{ activeProjectStore.activeProject.description }}
          </CardTitle>
        </CardHeader>
        <Separator label="stories"></Separator>
        <CardContent class="grid gap-4 lg:grid-cols-3 items-start p-2">
          <!-- TODO: make state cart into custom component -->
          <KanbanCard variant="todo">
            <template v-slot:title>ToDo</template>
            <template v-slot:content>
              <KanbanListItem
                v-for="story in storyStore.getByStatus.todo"
                :story="story"
                @click="handleStorySelection(story.id)"
              />
            </template>
          </KanbanCard>
          <KanbanCard variant="doing">
            <template v-slot:title>Doing</template>
            <template v-slot:content>
              <KanbanListItem
                v-for="story in storyStore.getByStatus.doing"
                :story="story"
                @click="handleStorySelection(story.id)"
              />
            </template>
          </KanbanCard>
          <KanbanCard variant="done">
            <template v-slot:title>Done</template>
            <template v-slot:content>
              <KanbanListItem
                v-for="story in storyStore.getByStatus.done"
                :story="story"
                @click="handleStorySelection(story.id)"
              />
            </template>
          </KanbanCard>
        </CardContent>
      </Card>
    </div>
    <div v-if="activeProjectStore.error">
      <Card class="grid grid-cols-[1fr_auto] m-2 p-2">
        <h1 class="text-2xl font-semibold justify-self-center">
          {{ activeProjectStore.error }}
        </h1>
        <Button @click="handleBackToDashboard" class="justify-self-end">
          Back
        </Button>
      </Card>
    </div>
    <Toaster />
    <Button @click="showCreateStoryPage" class="fixed bottom-8 right-8">
      <PlusIcon />
      Add story
    </Button>
  </div>
</template>

<style></style>
