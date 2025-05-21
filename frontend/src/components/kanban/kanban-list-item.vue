<script setup lang="ts" generic="T extends KanbanItem">
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import type { KanbanItem } from '@/types';

const emit = defineEmits(['edit', 'delete', 'select']);
</script>
<template>
  <div
    class="border-l-4 p-2 rounded-lg bg-white dark:bg-gray-800/30 relative space-y-2 break-words cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:shadow-sm transition-all duration-200 ease-in-out"
    @click="emit('select')"
  >
    <div @click.stop class="absolute top-2 right-2">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button size="sm">...</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem @click.stop="emit('edit')">Update</DropdownMenuItem>
          <DropdownMenuItem @click.stop="emit('delete')">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <h3 class="m-0"><slot name="title" /></h3>
    <p class="text-xs"><slot name="description" /></p>
    <div class="space-x-2">
      <slot name="badges" />
    </div>
  </div>
</template>

<style scoped></style>
