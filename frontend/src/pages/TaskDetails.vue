<script setup lang="ts">
import router from '@/router';
import { onMounted, onUnmounted, watch, ref, computed } from 'vue';
import { useRoute } from 'vue-router';

import { useActiveTaskStore, useTaskStore } from '@/store';
import {
  KanbanPriority,
  KanbanStatus,
  type TaskField,
  type TaskRecord,
} from '@/types';
import { useTaskBusinessLogic } from '@/composables/useTaskBusinessLogic';
import { toast } from '@/components/ui/toast';

import { Toaster } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { MenuIcon } from 'lucide-vue-next';

import {
  TaskDetailsSidebar,
  TaskTitleCard,
  TaskDescriptionCard,
  TaskTimelineCard,
  TaskAdditionalInfoCard,
} from '@/components/tasks';

import { AVAILABLE_PERFORMER_ROLES } from '@/components/tasks';

const activeTaskStore = useActiveTaskStore();
const taskStore = useTaskStore();
const route = useRoute();

const { updateTaskWithLogic } = useTaskBusinessLogic();

const editingField = ref<string | null>(null);
const isDrawerOpen = ref(false);

const tempValues = ref<Partial<TaskRecord>>({
  title: '',
  description: '',
  performer: '',
  status: 'todo' as KanbanStatus,
  priority: 'medium' as KanbanPriority,
  plannedEnd: '',
});

const task = computed(() => activeTaskStore.activeTask);

watch(
  () => route.params.taskId,
  async newId => {
    activeTaskStore.clearActiveTask();
    newId = Array.isArray(newId) ? newId[0] : newId;
    if (!newId) return;
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

const startEdit = (field: string) => {
  if (!task.value) return;

  editingField.value = field;
  tempValues.value = {
    title: task.value.title,
    description: task.value.description,
    performer: task.value.performer || '',
    status: task.value.status,
    priority: task.value.priority,
    plannedEnd: task.value.plannedEnd,
  };
};

const cancelEdit = () => {
  editingField.value = null;
};

const saveEdit = async (field: TaskField) => {
  if (!task.value) {
    console.error('No task available');
    return;
  }

  const fieldValue = tempValues.value[field as keyof typeof tempValues.value];

  if (task.value[field] === fieldValue) {
    cancelEdit();
    return;
  }

  try {
    const updates: Partial<TaskRecord> = { [field]: tempValues.value[field] };

    await updateTaskWithLogic(task.value.id, updates);

    toast({
      title: 'Task updated',
      description: `Successfully updated ${field}`,
    });

    editingField.value = null;
  } catch (error) {
    cancelEdit();
    console.error('Error updating task:', error);
    toast({
      title: 'Update failed',
      description:
        error instanceof Error ? error.message : 'Unknown error occurred',
      variant: 'destructive',
    });
  }
};

const updateTempValue = (field: TaskField, value: string) => {
  (tempValues.value as any)[field] = value;
};
</script>

<template>
  <div class="h-screen flex flex-col">
    <Card class="flex items-center justify-between p-4 border-b">
      <div class="flex items-center gap-4">
        <Button @click="router.go(-1)">Back</Button>
        <h1 class="text-2xl font-semibold">
          {{ task?.title || 'Loading...' }}
        </h1>
      </div>
      <div class="md:hidden">
        <Drawer v-model:open="isDrawerOpen">
          <DrawerTrigger as-child>
            <Button variant="outline" size="sm">
              <MenuIcon class="w-4 h-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Task Details</DrawerTitle>
              <DrawerDescription>Edit task information</DrawerDescription>
            </DrawerHeader>
            <div class="px-4 pb-4">
              <TaskDetailsSidebar
                v-if="task"
                :task="task"
                :editing-field="editingField"
                :temp-values="tempValues"
                :available-performer-roles="AVAILABLE_PERFORMER_ROLES"
                @start-edit="startEdit"
                @save-edit="saveEdit"
                @cancel-edit="cancelEdit"
                @update-temp-value="updateTempValue"
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </Card>

    <div class="flex flex-1 overflow-hidden">
      <div class="flex-1 p-6 overflow-y-auto">
        <div v-if="task" class="max-w-4xl mx-auto space-y-6">
          <TaskTitleCard
            :task="task"
            :editing-field="editingField"
            :temp-title="tempValues.title"
            @start-edit="startEdit"
            @save-edit="saveEdit"
            @cancel-edit="cancelEdit"
            @update-temp-value="updateTempValue"
          />

          <TaskDescriptionCard
            :task="task"
            :editing-field="editingField"
            :temp-description="tempValues.description"
            @start-edit="startEdit"
            @save-edit="saveEdit"
            @cancel-edit="cancelEdit"
            @update-temp-value="updateTempValue"
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TaskTimelineCard :task="task" />

            <TaskAdditionalInfoCard :task="task" />
          </div>
        </div>
      </div>

      <div class="hidden md:block w-80 border-l">
        <div class="p-6 h-full overflow-y-auto">
          <h2 class="text-lg font-semibold mb-4">Task Details</h2>

          <TaskDetailsSidebar
            v-if="task"
            :task="task"
            :editing-field="editingField"
            :temp-values="tempValues"
            :available-performer-roles="AVAILABLE_PERFORMER_ROLES"
            @start-edit="startEdit"
            @save-edit="saveEdit"
            @cancel-edit="cancelEdit"
            @update-temp-value="updateTempValue"
          />
        </div>
      </div>
    </div>
    <Toaster />
  </div>
</template>

<style scoped></style>
