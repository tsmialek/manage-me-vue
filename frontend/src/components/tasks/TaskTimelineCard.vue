<script setup lang="ts">
import type { TaskRecord } from '@/types';

import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { ClockIcon } from 'lucide-vue-next';
import { DateUtils } from '@/lib/utils';

interface Props {
  task: TaskRecord;
}

defineProps<Props>();
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <ClockIcon class="w-5 h-5" />
        Timeline
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-3">
      <div>
        <p class="text-sm font-medium text-gray-600">Created</p>
        <p class="text-sm">{{ DateUtils.format(task.created) }}</p>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-600">Last Updated</p>
        <p class="text-sm">{{ DateUtils.format(task.updated) }}</p>
      </div>
      <div v-if="task.startTime">
        <p class="text-sm font-medium text-gray-600">Started</p>
        <p class="text-sm">{{ DateUtils.format(task.startTime) }}</p>
      </div>
      <div v-if="task.endTime">
        <p class="text-sm font-medium text-gray-600">Completed</p>
        <p class="text-sm">{{ DateUtils.format(task.endTime) }}</p>
      </div>
    </CardContent>
  </Card>
</template>
