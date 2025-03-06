<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';

import DataTable from '@/components/projects/data-table.vue';

import { columns } from '@/components/projects/columns';
import type { Project } from '@/components/projects/types';
import type { ProjectRepository } from './repositories/ProjectRepository';

const projectRepository = inject<ProjectRepository>('project-repository');
const projects = ref<Project[]>([]);
// TODO:
const error = ref<string | null>(null);
const loading = ref(false);

function handleDropdownAction(action: string, projectPayload: Project): void {
  switch (action) {
    case 'delete-project':
      console.log(`Project with id: ${projectPayload.id} deleted`);
      projects.value = projects.value.filter(p => p.id !== projectPayload.id);
      break;
    default:
      console.log(`Unknown dropdown action: ${action}`);
  }
}

onMounted(async () => {
  if (!projectRepository) {
    error.value = 'Project repository not available';
    return;
  }

  loading.value = true;
  try {
    projects.value = await projectRepository.getProjects();
  } catch (err) {
    console.log(err);
    error.value = 'Failed to load projects';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="container py-10 mx-auto">
    <DataTable :columns="columns(handleDropdownAction)" :data="projects" />
  </div>
</template>

<style scoped></style>
