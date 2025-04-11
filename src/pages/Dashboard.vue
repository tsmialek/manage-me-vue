<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useColorMode } from '@vueuse/core';

import { DataTable, columns } from '@/components/projects';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

import { useProjectStore, useAuthStore } from '@/store';
import type { ProjectRecord } from '@/types';

const projectStore = useProjectStore();
const authStore = useAuthStore();

const mode = useColorMode({ disableTransition: false });
const isDark = computed(() => mode.value === 'dark');

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

const toggleTheme = () => {
  mode.value = isDark.value ? 'light' : 'dark';
};

onMounted(async () => {
  await projectStore.fetchProjects();
  projectStore.initializeRealtimeUpdates();
});

onUnmounted(async () => {
  projectStore.unsubscribeFromRealtimeUpdates();
});
</script>
<!-- TODO: create global appStore to manage modals and loading state -->
<template>
  <div class="">
    <div class="">
      <p>Logged in as: {{ authStore.currentUser?.name }}</p>
      <Badge>{{ authStore.currentUser?.role }}</Badge>
      <Button @click="authStore.logOut()">Logout</Button>
      <Label for="theme">Choose theme</Label>
      <Switch
        :model-value="isDark"
        @update:model-value="toggleTheme"
        id="theme"
      ></Switch>
    </div>
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
