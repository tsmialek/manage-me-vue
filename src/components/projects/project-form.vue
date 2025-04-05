<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form';
import { Button } from '@/components/ui/button';
import * as z from 'zod';

import { useAppStore, useProjectStore, useUserStore } from '@/store';
import type { BaseProject, ProjectRecord } from '@/types';

const projectStore = useProjectStore();
const appStore = useAppStore();
const userStore = useUserStore();

const { project } = defineProps<{
  project: ProjectRecord;
}>();

const initialValues = project
  ? {
      title: project.title,
      description: project.description,
    }
  : undefined;

const schema = z.object({
  title: z.string(),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters')
    .max(200, 'Description must not be longer than 200 characters'),
});

// TODO: add assigning project to user
async function onSubmit(values: Omit<BaseProject, 'user'>) {
  if (project) {
    // update
    await projectStore.updateProject(project.id, { ...values });
  } else {
    // create
    const newProject = {
      ...values,
      user: [userStore.currentUserId],
    };
    await projectStore.addProject(newProject);
  }
  appStore.closeModal();
}
</script>

<template>
  <AutoForm
    class="space-y-6 min-w-[30rem]"
    :schema="schema"
    :initial-values="initialValues"
    :field-config="{
      description: { component: 'textarea' },
    }"
    @submit="onSubmit"
  >
    <Button type="submit">Submit</Button>
  </AutoForm>
</template>
