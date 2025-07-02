<script setup lang="ts">
import {
  type TaskRecord,
  type TaskFieldsEmits,
  type TaskField,
  KanbanPriority,
  KanbanStatus,
} from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EditControls } from '@/components/ui/edit-controls';
import { CalendarIcon, EditIcon, UserIcon, FlagIcon } from 'lucide-vue-next';
import { DateUtils } from '@/lib/utils';

interface Props {
  task: TaskRecord;
  editingField: string | null;
  tempValues: Partial<TaskRecord>;
}

defineProps<Props>();
const emit = defineEmits<TaskFieldsEmits>();
</script>

<template>
  <div class="space-y-4">
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="flex items-center gap-2">
            <UserIcon class="w-5 h-5" />
            Performer
          </CardTitle>
          <Button
            v-if="editingField !== 'performer'"
            variant="ghost"
            size="sm"
            @click="emit('start-edit', 'performer')"
          >
            <EditIcon class="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="editingField === 'performer'" class="space-y-2">
          <Input
            :model-value="tempValues.performer"
            @update:model-value="(value) => emit('update-temp-value', 'performer', value as TaskField)"
            placeholder="Enter performer name"
          />
          <EditControls
            @save="emit('save-edit', 'performer')"
            @cancel="emit('cancel-edit')"
          />
        </div>
        <p v-else>
          {{
            task?.expand?.performer?.name || task?.performer || 'Not assigned'
          }}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="flex items-center gap-2">
            <CheckIcon class="w-5 h-5" />
            Status
          </CardTitle>
          <Button
            v-if="editingField !== 'status'"
            variant="ghost"
            size="sm"
            @click="emit('start-edit', 'status')"
          >
            <EditIcon class="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="editingField === 'status'" class="space-y-2">
          <Select
            :model-value="tempValues.status"
            @update:model-value="(value) => emit('update-temp-value', 'status', value as string)"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="option in KanbanStatus"
                :key="option"
                :value="option"
              >
                {{ option }}
              </SelectItem>
            </SelectContent>
          </Select>
          <EditControls
            @save="emit('save-edit', 'status')"
            @cancel="emit('cancel-edit')"
          />
        </div>
        <Badge v-else>
          {{ task?.status?.toUpperCase() }}
        </Badge>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="flex items-center gap-2">
            <FlagIcon class="w-5 h-5" />
            Priority
          </CardTitle>
          <Button
            v-if="editingField !== 'priority'"
            variant="ghost"
            size="sm"
            @click="emit('start-edit', 'priority')"
          >
            <EditIcon class="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="editingField === 'priority'" class="space-y-2">
          <Select
            :model-value="tempValues.priority"
            @update:model-value="(value) => emit('update-temp-value', 'priority', value as string)"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="option in KanbanPriority"
                :key="option"
                :value="option"
              >
                {{ option }}
              </SelectItem>
            </SelectContent>
          </Select>
          <EditControls
            @save="emit('save-edit', 'priority')"
            @cancel="emit('cancel-edit')"
          />
        </div>
        <Badge v-else>
          {{ task?.priority?.toUpperCase() }}
        </Badge>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="flex items-center gap-2">
            <CalendarIcon class="w-5 h-5" />
            Planned End
          </CardTitle>
          <Button
            v-if="editingField !== 'plannedEnd'"
            variant="ghost"
            size="sm"
            @click="emit('start-edit', 'plannedEnd')"
          >
            <EditIcon class="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="editingField === 'plannedEnd'" class="space-y-2">
          <Input
            type="datetime-local"
            :model-value="tempValues.plannedEnd"
            @update:model-value="(value) => emit('update-temp-value', 'plannedEnd', value as string)"
          />
          <EditControls
            @save="emit('save-edit', 'plannedEnd')"
            @cancel="emit('cancel-edit')"
          />
        </div>
        <p v-else>{{ DateUtils.format(task?.plannedEnd) }}</p>
      </CardContent>
    </Card>
  </div>
</template>
