<script setup lang="ts">
import router from '@/router';
import { useRoute } from 'vue-router';
import { onMounted, onUnmounted, watch } from 'vue';

import { AddStoryForm } from '@/components/stories';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { useActiveProjectStore, useAppStore, useStoryStore } from '@/store';

const activeProjectStore = useActiveProjectStore();
const storyStore = useStoryStore();
const appStore = useAppStore();
const route = useRoute();

const handleBackToDashboard = async () => {
  activeProjectStore.clearActiveProject();
  router.push({ name: 'Dashboard' });
};

const showCreateStoryPage = () => {
  appStore.openModal('create-story', AddStoryForm, 'Create Story');
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
  <div class="">
    <div v-if="activeProjectStore.activeProject" class="p-4 space-y-4">
      <Card class="grid grid-cols-[1fr_auto] p-2">
        <h1 class="text-2xl font-semibold justify-self-center">
          {{ activeProjectStore.activeProject.title }}
        </h1>
        <Button @click="handleBackToDashboard" class="justify-self-end">
          Back
        </Button>
      </Card>
      <Card class="p-4 space-y-4">
        <CardHeader>
          <CardTitle class="text-lg font-semibold space-y-2">
            <p><Badge>description:</Badge></p>
            <h2>
              {{ activeProjectStore.activeProject.description }}
            </h2>
            <Button @click="showCreateStoryPage">Add story</Button>
          </CardTitle>
        </CardHeader>
        <Separator label="stories"></Separator>
        <CardContent class="grid gap-4 lg:grid-cols-3">
          <!-- TODO: make state cart into custom component -->
          <div id="todo" class="project-story-state">
            todo
            <p v-for="story in storyStore.getByStatus.todo">
              {{ story.name }}
            </p>
          </div>
          <div
            id="doing"
            class="project-story-state bg-amber-50 dark:bg-amber-900/30"
          >
            doing
            <p v-for="story in storyStore.getByStatus.doing">
              {{ story.name }}
            </p>
          </div>
          <div
            id="done"
            class="project-story-state bg-emerald-50 dark:bg-emerald-900/30"
          >
            done
          </div>
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
  </div>
</template>

<style></style>
