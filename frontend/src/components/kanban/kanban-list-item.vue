<script setup lang="ts" generic="T extends KanbanItem">
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-vue-next';

import type { KanbanItem } from '@/types';

const emit = defineEmits(['edit', 'delete', 'click']);
</script>
<template>
  <div
    class="border-l-4 p-2 rounded-lg bg-white relative space-y-2 break-words"
    @click="emit('click')"
  >
    <Button size="sm" class="absolute top-2 right-2" @click.stop="emit('edit')">
      <Settings />
    </Button>
    <h3 class="m-0"><slot name="title" /></h3>
    <p class="text-xs"><slot name="description" /></p>
    <div class="space-x-2">
      <slot name="badges" />
    </div>
  </div>
</template>

<style scoped></style>
