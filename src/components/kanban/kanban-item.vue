<script setup lang="ts" generic="TExpand">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-vue-next';
import { StoryForm } from '../stories';

import type { KanbanItem } from '@/types';
import { useAppStore } from '@/store';

const appStore = useAppStore();

defineProps<{
  story: KanbanItem<TExpand>;
}>();
</script>
<template>
  <div
    class="border-l-4 p-2 rounded-lg bg-white relative space-y-2 break-words"
  >
    <!-- TODO: Add dropdown menu with update and delete options -->
    <!-- TODO: (OPTIONALLY) add drag and drop functionality -->
    <Button
      size="sm"
      class="absolute top-2 right-2"
      @click.stop="
        appStore.openModal('update-story', StoryForm, 'Update Story', {
          story: story,
        })
      "
    >
      <Settings />
    </Button>
    <h3 class="m-0">{{ story.name }}</h3>
    <p class="text-xs">{{ story.description }}</p>
    <div class="space-x-2">
      <Badge variant="secondary">Priority: {{ story.priority }}</Badge>
      <Badge variant="secondary">
        Owner: {{ story.expand?.owner?.name ?? '---' }}
      </Badge>
    </div>
  </div>
</template>

<style scoped></style>
