<script setup lang="ts">
import type { TaskRecord } from '@/types';

import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';

interface Props {
  task: TaskRecord;
}

defineProps<Props>();
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Additional Information</CardTitle>
    </CardHeader>
    <CardContent class="space-y-3">
      <div>
        <p class="text-sm text-gray-600">Task ID</p>
        <p class="text-sm font-mono">{{ task.id }}</p>
      </div>
      <div v-if="task.expand?.story">
        <p class="text-sm text-gray-600">Story</p>
        <p class="text-sm">{{ task.expand.story.title }}</p>
      </div>
    </CardContent>
  </Card>
</template>
