<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useActiveTaskStore, useTaskStore } from '@/store';

const activeTaskStore = useActiveTaskStore();
const taskStore = useTaskStore();
const route = useRoute();

watch(
  () => route.params.taskId,
  async newId => {
    activeTaskStore.clearActiveTask();
    newId = Array.isArray(newId) ? newId[0] : newId;
    await activeTaskStore.setActiveTask(newId);
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
  <div>{{ activeTaskStore.activeTaskId }}</div>
</template>

<style scoped></style>
