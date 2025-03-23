<script setup lang="ts">
import router from '@/router';
import { useRoute } from 'vue-router';
import { watch } from 'vue';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { useActiveProjectStore } from '@/store';

const activeProjectStore = useActiveProjectStore();
const route = useRoute();

const handleBackToDashboard = async () => {
  router.push({ name: 'Dashboard' });
  await activeProjectStore.clearActiveProject();
};

watch(
  () => route.params.projectId,
  async newId => {
    activeProjectStore.clearActiveProject();
    console.log(newId);
    newId = Array.isArray(newId) ? newId[0] : newId;
    await activeProjectStore.setActiveProject(newId);
  },
  { immediate: true }
);
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
          </CardTitle>
        </CardHeader>
        <Separator label="kanban"></Separator>
        <CardContent class="grid gap-4 lg:grid-cols-3">
          <!-- TODO: make state cart into custom component -->
          <div id="todo" class="project-story-state">todo</div>
          <div
            id="doing"
            class="project-story-state bg-amber-50 dark:bg-amber-900/30"
          >
            todo
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
    <div v-else>
      <Card class="grid grid-cols-[1fr_auto] m-2 p-2">
        <h1 class="text-2xl font-semibold justify-self-center">
          Couldn't load project details ;(
        </h1>
        <Button @click="handleBackToDashboard" class="justify-self-end">
          Back
        </Button>
      </Card>
    </div>
  </div>
</template>

<style></style>
