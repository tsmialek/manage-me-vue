<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form';
import { Button } from '@/components/ui/button';
import * as z from 'zod';

import {
  useAppStore,
  useStoryStore,
  useAuthStore,
  useActiveProjectStore,
} from '@/store';
import type { NewStory, StoryRecord } from '@/types';
import { KanbanPriority, KanbanStatus } from '@/types';

const { story } = defineProps<{
  story?: StoryRecord;
}>();

const appStore = useAppStore();
const storyStore = useStoryStore();
const authStore = useAuthStore();
const activeProjectStore = useActiveProjectStore();

const initialValues = story
  ? {
      title: story.title,
      description: story.description,
      priority: story.priority,
      status: story.status,
    }
  : undefined;

const schema = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.nativeEnum(KanbanPriority).default(KanbanPriority.low),
  status: z.nativeEnum(KanbanStatus).default(KanbanStatus.todo),
});

async function onSubmit(values: Omit<NewStory, 'owner' | 'project'>) {
  if (story) {
    await storyStore.updateStory(story.id, {
      ...values,
    });
  } else {
    const newStory = {
      ...values,
      owner: authStore.currentUserId,
      project: activeProjectStore.activeProjectId,
    };
    console.log(newStory);
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
