<script setup lang="ts">
import { ref } from 'vue';

import DataTable from '@/components/projects/data-table.vue';

import { columns } from '@/components/projects/columns';
import { projects } from '@/components/projects/mocks';

const projectsData = ref(projects);
</script>

<template>
  <div class="container py-10 mx-auto">
    <DataTable :columns="columns" :data="projectsData" />
  </div>
</template>

<style scoped></style>
