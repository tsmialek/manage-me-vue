<script setup lang="ts">
import { onMounted } from 'vue';

import DataTable from '@/components/projects/data-table.vue';

import { columns } from '@/components/projects/columns';
import { useProjectStore } from '@/store/ProjectStore';
import ProjectsService from '@/services/ProjectsService';
import type { ProjectRecord } from '@/types';

const projectStore = useProjectStore();

async function handleDropdownAction(
  action: string,
  projectPayload: ProjectRecord
): Promise<void> {
  switch (action) {
    case 'delete-project':
      console.log(`Project with id: ${projectPayload.id} deleted`);
      await projectStore.deleteProject(projectPayload.id);
      break;
    default:
      console.log(`Unknown dropdown action: ${action}`);
  }
}

onMounted(async () => {
  await projectStore.fetchProjects();
  ProjectsService.subscribeToProjects(projectStore.handleRealTimeUpdates);
  console.log(projectStore.projects);
});
</script>

<template>
  <div class="container py-10 mx-auto">
    <DataTable
      :columns="columns(handleDropdownAction)"
      :data="projectStore.projects"
    />
    <p v-if="projectStore.error">{{ projectStore.error }}</p>
  </div>
</template>

<style scoped></style>
