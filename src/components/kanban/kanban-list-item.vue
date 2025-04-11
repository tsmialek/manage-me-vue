<script setup lang="ts" generic="T extends KanbanItem">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-vue-next';

import type { KanbanItem } from '@/types';

defineProps<{
  item: T;
  owner?: string;
  performer?: string;
}>();

const emit = defineEmits(['edit', 'delete', 'click']);
</script>
<template>
  <div
    class="border-l-4 p-2 rounded-lg bg-white relative space-y-2 break-words"
    @click="emit('click', item)"
  >
    <!-- TODO: Add dropdown menu with update and delete options -->
    <!-- TODO: (OPTIONALLY) add drag and drop functionality -->
    <!-- TODO: Check if scoped props can be used -->
    <Button
      size="sm"
      class="absolute top-2 right-2"
      @click.stop="emit('edit', item)"
    >
      <Settings />
    </Button>
    <h3 class="m-0">{{ item.title }}</h3>
    <p class="text-xs">{{ item.description }}</p>
    <div class="space-x-2">
      <Badge variant="secondary">Priority: {{ item.priority }}</Badge>
      <Badge variant="secondary" v-if="owner">Owner: {{ owner }}</Badge>
      <Badge variant="secondary" v-if="performer">
        Asignee: {{ performer }}
      </Badge>
    </div>
  </div>
</template>

<style scoped></style>
