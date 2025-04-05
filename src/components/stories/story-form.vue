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
import type { NewStory, StoryRecord } from '@/types';

const { story } = defineProps<{
  story?: StoryRecord;
}>();

const appStore = useAppStore();
const storyStore = useStoryStore();
const userStore = useUserStore();
const activeProjectStore = useActiveProjectStore();

const initialValues = story
  ? {
      name: story.name,
      description: story.description,
      priority: story.priority,
      status: story.status,
    }
  : undefined;

const schema = z.object({
  name: z.string(),
  description: z.string(),
  priority: z.enum(['low', 'medium', 'high']).default('low'),
  status: z.enum(['todo', 'doing', 'done']).default('todo'),
});

async function onSubmit(values: Omit<NewStory, 'owner' | 'project'>) {
  if (story) {
    // update
    await storyStore.updateStory(story.id, {
      ...values,
    });
  } else {
    // create
    const newStory = {
      ...values,
      owner: userStore.currentUserId,
      project: activeProjectStore.activeProjectId,
    };
    await storyStore.addStory(newStory);
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

<style scoped></style>
