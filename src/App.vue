<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

import DataTable from '@/components/projects/data-table.vue';
import { Toaster } from '@/components/ui/toast';

import { columns } from '@/components/projects/columns';
import { useProjectStore } from '@/store/ProjectStore';
import type { ProjectRecord } from '@/types';

const projectStore = useProjectStore();

async function handleDropdownAction(
  action: string,
  projectPayload: ProjectRecord
): Promise<void> {
  switch (action) {
    case 'delete-project':
      console.log(`Project with id: ${projectPayload.id} deleted`);
      await projectStore.deleteProject(projectPayload);
      break;
    default:
      console.log(`Unknown dropdown action: ${action}`);
  }
}

onMounted(async () => {
  await projectStore.fetchProjects();
  projectStore.initializeRealtimeUpdates();
  console.log(projectStore.projects);
});

onUnmounted(async () => {
  projectStore.unsubscribeFromRealtimeUpdates();
});
</script>

<template>
  <div class="container py-10 mx-auto">
    <DataTable
      :columns="columns(handleDropdownAction)"
      :data="projectStore.projects"
    />
  </div>
  <Toaster />
</template>

<style scoped></style>
