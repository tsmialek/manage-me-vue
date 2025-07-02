<script setup lang="ts">
import router from '@/router';
import { onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useActiveTaskStore, useTaskStore } from '@/store';

import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PlusIcon } from 'lucide-vue-next';
import { Toaster } from '@/components/ui/toast';

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
  <Card class="grid grid-cols-[1fr_auto] p-4">
    <h1 class="text-2xl font-semibold justify-self-center">
      {{ activeTaskStore.activeTask?.title }}
    </h1>
    <Button @click="router.go(-1)" class="justify-self-end">Back</Button>
  </Card>
</template>

<style scoped></style>
