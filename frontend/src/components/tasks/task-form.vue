<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { toDate } from 'reka-ui/date';
import * as z from 'zod';

import { CalendarIcon } from 'lucide-vue-next';

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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  today,
} from '@internationalized/date';

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
const df = new DateFormatter('en-US', {
  dateStyle: 'long',
});

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string(),
    priority: z.nativeEnum(KanbanPriority).default(KanbanPriority.low),
    status: z.nativeEnum(KanbanStatus).default(KanbanStatus.todo),
    plannedEnd: z.string(),
  })
);

const plannedEndPlaceholder = ref();
const value = computed({
  get: () =>
    values.plannedEnd
      ? parseDate(values.plannedEnd.replace(' ', 'T'))
      : undefined,
  set: val => val,
});

const { isFieldDirty, handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async formValues => {
  try {
    const newTask: NewTask = {
      ...formValues,
      story: activeStoryStore.activeStoryId,
      status: KanbanStatus.todo,
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
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="status">
        <FormItem class="flex-1">
          <FormLabel>Status</FormLabel>
          <Select>
            <FormControl>
              <SelectTrigger disabled>
                <SelectValue placeholder="To Do" />
              </SelectTrigger>
            </FormControl>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <FormField name="plannedEnd">
      <FormItem class="flex flex-col">
        <FormLabel>Planned End Date</FormLabel>
        <Popover>
          <PopoverTrigger as-child>
            <FormControl>
              <Button variant="outline">
                <span>
                  {{ value ? df.format(toDate(value)) : 'Pick a date' }}
                </span>
                <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
              </Button>
              <input hidden />
            </FormControl>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar
              v-model:placeholder="plannedEndPlaceholder"
              v-model="value"
              calendar-label="Planned end date"
              initial-focus
              :max-value="new CalendarDate(2100, 1, 1)"
              :min-value="today(getLocalTimeZone())"
              @update:model-value="
                v => {
                  if (v) {
                    setFieldValue('plannedEnd', v.toString());
                  } else {
                    setFieldValue('plannedEnd', undefined);
                  }
                }
              "
            />
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" class="w-full">Create Task</Button>
  </form>
</template>

<style scoped></style>
