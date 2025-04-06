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

import { KanbanStatus } from '@/types';

import {
  useActiveProjectStore,
  useAppStore,
  useStoryStore,
  useActiveStoryStore,
  useTaskStore,
} from '@/store';

const activeProjectStore = useActiveProjectStore();
const storyStore = useStoryStore();
const activeStoryStore = useActiveStoryStore();
const appStore = useAppStore();
const taskStore = useTaskStore();
const route = useRoute();

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
  <div class="relative">
    <div v-if="activeProjectStore.activeProject" class="p-4 space-y-4">
      <Card class="grid grid-cols-[1fr_auto] p-4">
        <h1 class="text-2xl font-semibold justify-self-center">
          {{ activeProjectStore.activeProject.title }}
        </h1>
        <Button @click="router.go(-1)" class="justify-self-end">Back</Button>
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
                v-for="task in taskStore.getByStatus.todo"
                :story="task"
              />
            </template>
          </KanbanCard>
          <KanbanCard variant="todo">
            <template v-slot:title>Doing</template>
            <template v-slot:content>
              <KanbanListItem
                v-for="task in taskStore.getByStatus.todo"
                :story="task"
              />
            </template>
          </KanbanCard>
          <KanbanCard variant="done">
            <template v-slot:title>Done</template>
            <template v-slot:content>
              <KanbanListItem
                v-for="task in taskStore.getByStatus.todo"
                :story="task"
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
        <Button @click="router.go(-1)" class="justify-self-end">Back</Button>
      </Card>
    </div>
    <Toaster />
    <Button @click="" class="fixed bottom-8 right-8">
      <PlusIcon />
      Add story
    </Button>
  </div>
</template>

<style scoped></style>
