<script setup lang="ts">
import type { TaskRecord, TaskFieldsEmits, TaskField } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { EditIcon, FileTextIcon } from 'lucide-vue-next';
import { EditControls } from '@/components/ui/edit-controls';

interface Props {
  task: TaskRecord;
  editingField: string | null;
  tempTitle?: string;
}

defineProps<Props>();
const emit = defineEmits<TaskFieldsEmits>();
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle class="flex items-center gap-2">
          <FileTextIcon class="w-5 h-5" />
          Title
        </CardTitle>
        <Button
          v-if="editingField !== 'title'"
          variant="ghost"
          size="sm"
          @click="emit('start-edit', 'title')"
        >
          <EditIcon class="w-4 h-4" />
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div v-if="editingField === 'title'" class="space-y-2">
        <Input
          :model-value="tempTitle"
          @update:model-value="(value) => emit('update-temp-value', 'title', value as TaskField)"
          placeholder="Enter task title"
          class="w-full"
        />
        <EditControls
          @save="emit('save-edit', 'title')"
          @cancel="emit('cancel-edit')"
        />
      </div>
      <p v-else class="text-lg">{{ task.title }}</p>
    </CardContent>
  </Card>
</template>
