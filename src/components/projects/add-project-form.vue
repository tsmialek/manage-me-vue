<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form';
import { Button } from '@/components/ui/button';
import * as z from 'zod';

import { useProjectStore } from '@/store/ProjectStore';
import type { ProjectBase } from '@/types';

const projectStore = useProjectStore();
const emit = defineEmits(['close']);

const schema = z.object({
  title: z.string(),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters')
    .max(200, 'Description must not be longer than 200 characters'),
});

// TODO: add assigning project to user
async function onSubmit(values: Omit<ProjectBase, 'user'>) {
  emit('close');
  const newProject = {
    ...values,
    user: ['00zg5lax1dkz320'],
  };
  projectStore.addProject(newProject);
}
</script>

<template>
  <AutoForm
    class="space-y-6 min-w-[30rem]"
    :schema="schema"
    :field-config="{
      description: { component: 'textarea' },
    }"
    @submit="onSubmit"
  >
    <Button type="submit">Submit</Button>
  </AutoForm>
</template>
