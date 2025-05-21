<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

import { DataTable, columns } from '@/components/projects';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

import { useProjectStore, useAuthStore, useAppStore } from '@/store';
import type { ProjectRecord } from '@/types';

const projectStore = useProjectStore();
const authStore = useAuthStore();
const appStore = useAppStore();

async function handleDropdownAction(
  action: string,
  projectPayload: ProjectRecord
): Promise<void> {
  switch (action) {
    default:
      console.log(
        `Unknown dropdown action: ${action}, Project : ${projectPayload}`
      );
  }
}

onMounted(async () => {
  await projectStore.fetchProjects();
  projectStore.initializeRealtimeUpdates();
});

onUnmounted(async () => {
  projectStore.unsubscribeFromRealtimeUpdates();
});
</script>
<template>
  <div>
    <Card class="container mx-auto my-4 p-4 flex justify-between">
      <div class="space-y-2 text-lg font-semibold">
        <p>User: {{ authStore.currentUser?.name }}</p>
        <p>
          Role:
          <Badge>{{ authStore.currentUser?.role }}</Badge>
        </p>
      </div>
      <div class="space-y-2 flex flex-col items-end">
        <Button @click="authStore.logOut()">Logout</Button>
        <div class="flex items-center space-x-2">
          <Label for="theme">
            Theme: {{ appStore.isDark ? 'Dark' : 'Light' }}
          </Label>
          <Switch
            :model-value="appStore.isDark"
            @update:model-value="appStore.toggleColorMode()"
            id="theme"
          ></Switch>
        </div>
      </div>
    </Card>
    <div class="container py-10 mx-auto">
      <DataTable
        :columns="columns(handleDropdownAction)"
        :data="projectStore.projects"
      />
    </div>
    <Toaster />
  </div>
</template>

<style scoped></style>
