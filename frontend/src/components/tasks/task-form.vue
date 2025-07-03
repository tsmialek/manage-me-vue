<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  useAppStore,
  useTaskStore,
  useActiveStoryStore,
  useUserStore,
} from '@/store';

import type { NewTask, UserRecord } from '@/types';
import { KanbanPriority, KanbanStatus } from '@/types';

const appStore = useAppStore();
const taskStore = useTaskStore();
const userStore = useUserStore();
const activeStoryStore = useActiveStoryStore();

const availableUsers = ref<UserRecord[]>([]);

// Priority options array
const priorityOptions = [
  { value: KanbanPriority.low, label: 'Low' },
  { value: KanbanPriority.medium, label: 'Medium' },
  { value: KanbanPriority.high, label: 'High' },
];

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string(),
    priority: z.nativeEnum(KanbanPriority).default(KanbanPriority.low),
    status: z.nativeEnum(KanbanStatus).default(KanbanStatus.todo),
    plannedEnd: z.string(),
  })
);

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async formValues => {
  try {
    const newTask: NewTask = {
      title: formValues.title,
      description: formValues.description,
      priority: formValues.priority,
      status: KanbanStatus.todo,
      plannedEnd: new Date(formValues.plannedEnd).toISOString(),
      performer: null,
      story: activeStoryStore.activeStoryId,
    };
    await taskStore.addTask(newTask);
    appStore.closeModal();
  } catch (error) {
    console.error('Error creating task:', error);
  }
});

onMounted(async () => {
  const developers = userStore.getByRole.developer || [];
  const devops = userStore.getByRole.devops || [];
  availableUsers.value = [...developers, ...devops];
});
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-6 w-[30vw] min-w-[250px]">
    <FormField
      v-slot="{ componentField: titleField }"
      name="title"
      :validate-on-blur="!isFieldDirty"
    >
      <FormItem>
        <FormLabel>Title</FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder="Enter task title"
            v-bind="titleField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField
      v-slot="{ componentField: descriptionField }"
      name="description"
      :validate-on-blur="!isFieldDirty"
    >
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Textarea
            placeholder="Enter task description"
            v-bind="descriptionField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex gap-6">
      <FormField v-slot="{ componentField: priorityField }" name="priority">
        <FormItem class="flex-1">
          <FormLabel>Priority</FormLabel>
          <Select v-bind="priorityField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="option in priorityOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField: statusField }" name="status">
        <FormItem class="flex-1">
          <FormLabel>Status</FormLabel>
          <Select v-bind="statusField" disabled>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="To Do" />
              </SelectTrigger>
            </FormControl>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <FormField name="plannedEnd" v-slot="{ componentField: plannedEndField }">
      <FormItem class="flex flex-col">
        <FormLabel>Planned End Date</FormLabel>
        <FormControl>
          <Input
            type="datetime-local"
            placeholder="Enter planned end date"
            v-bind="plannedEndField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" class="w-full">Create Task</Button>
  </form>
</template>

<style scoped></style>
