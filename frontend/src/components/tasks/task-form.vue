<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { toDate } from 'reka-ui/date';
import * as z from 'zod';

import { CalendarIcon } from 'lucide-vue-next';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
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

import type { NewTask, TaskRecord } from '@/types';
import { KanbanPriority, KanbanStatus } from '@/types';

const { task } = defineProps<{
  task?: TaskRecord;
}>();

const appStore = useAppStore();
const taskStore = useTaskStore();
const userStore = useUserStore();
const activeStoryStore = useActiveStoryStore();

const availableUsers = ref<string[]>([]);
const df = new DateFormatter('en-US', {
  dateStyle: 'long',
});

const initialValues = task
  ? {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      plannedEnd: new Date(task.plannedEnd).toISOString().split('T')[0],
      startTime: task.startTime,
      endTime: task.endTime,
      performer: task.expand?.performer?.name ?? 'Unassigned',
    }
  : {
      title: '',
      description: '',
      priority: KanbanPriority.low,
      status: KanbanStatus.todo,
      plannedEnd: '',
      startTime: '',
      endTime: '',
      performer: 'Unassigned',
    };

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(5),
    description: z.string(),
    priority: z.nativeEnum(KanbanPriority).default(KanbanPriority.low),
    status: z.nativeEnum(KanbanStatus).default(KanbanStatus.todo),
    plannedEnd: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    performer: z.string(),
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
  initialValues,
});

const onSubmit = handleSubmit(values => {
  console.log(values);
});

onMounted(async () => {
  availableUsers.value = userStore.getByRole.developer.map(
    user => user?.name ?? '---'
  );
});
</script>
<template>
  <div class="">
    <form @submit.prevent="onSubmit" class="space-y-6">
      <FormField
        v-slot="{ componentField: titleField }"
        name="title"
        :validate-on-blur="!isFieldDirty"
      >
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Title" v-bind="titleField" />
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
              type="text"
              placeholder="description"
              v-bind="descriptionField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField name="plannedEnd">
        <FormItem class="flex flex-col">
          <FormLabel>PlannedEnd</FormLabel>
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
                calendar-label="Date of birth"
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
      <Button type="submit">Submit</Button>
    </form>
  </div>
</template>

<style scoped></style>
