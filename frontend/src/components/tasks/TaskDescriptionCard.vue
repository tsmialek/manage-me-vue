<script setup lang="ts">
import type { TaskRecord, TaskFieldsEmits, TaskField } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { EditIcon, FileTextIcon } from 'lucide-vue-next';
import { EditControls } from '@/components/ui/edit-controls';

interface Props {
  task: TaskRecord;
  editingField: string | null;
  tempDescription?: string;
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
          Description
        </CardTitle>
        <Button
          v-if="editingField !== 'description'"
          variant="ghost"
          size="sm"
          @click="emit('start-edit', 'description')"
        >
          <EditIcon class="w-4 h-4" />
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div v-if="editingField === 'description'" class="space-y-2">
        <Textarea
          :model-value="tempDescription"
          @update:model-value="(value) => emit('update-temp-value', 'description', value as TaskField)"
          placeholder="Enter task description"
          class="w-full min-h-[120px]"
        />
        <EditControls
          @save="emit('save-edit', 'description')"
          @cancel="emit('cancel-edit')"
        />
      </div>
      <p v-else class="whitespace-pre-wrap">
        {{ task.description || 'No description provided' }}
      </p>
    </CardContent>
  </Card>
</template>
