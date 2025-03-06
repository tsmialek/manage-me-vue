<script setup lang="ts">
import { ref } from 'vue';

import DataTable from '@/components/projects/data-table.vue';

import { columns } from '@/components/projects/columns';
import { projects } from '@/components/projects/mocks';
import type { Project } from '@/components/projects/types';

const projectsData = ref(projects);

function handleDropdownAction(action: string, project: Project): void {
  switch (action) {
    case 'delete-project':
      console.log(`Project with id: ${project.id} deleted`);
      break;
    default:
      console.log(`Unknown dropdown action: ${action}`);
  }
}
</script>

<template>
  <div class="container py-10 mx-auto">
    <DataTable :columns="columns(handleDropdownAction)" :data="projectsData" />
    <Modal></Modal>
  </div>
</template>

<style scoped></style>
