<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form';
import { Button } from '@/components/ui/button';
import * as z from 'zod';

import {
  useAppStore,
  useStoryStore,
  useUserStore,
  useActiveProjectStore,
} from '@/store';

const appStore = useAppStore();
const storyStore = useStoryStore();
const userStore = useUserStore();
const activeProjectStore = useActiveProjectStore();

const schema = z.object({
  name: z.string(),
  description: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['todo', 'doing', 'done']),
});

import type { NewStory } from '@/types';

async function onSubmit(values: Omit<NewStory, 'user' | 'project'>) {
  const newStory = {
    ...values,
    user: userStore.currentUserId,
    project: activeProjectStore.activeProjectId,
  };
  storyStore.addStory(newStory);
  appStore.closeModal();
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

<style scoped></style>
