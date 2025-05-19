<script setup lang="ts" generic="T extends KanbanItem">
import { computed } from 'vue';

import { KanbanStatus } from '@/types';
import type { KanbanItem } from '@/types';

import { KanbanCard } from '.';
import KanbanListItem from './kanban-list-item.vue';

const props = defineProps<{
  items: T[];
}>();

const emit = defineEmits<{ itemSelect: [T]; itemEdit: [T]; itemDelete: [T] }>();

const groupedItems = computed(() => {
  return {
    todo: props.items.filter(item => item.status === KanbanStatus.todo),
    doing: props.items.filter(item => item.status === KanbanStatus.doing),
    done: props.items.filter(item => item.status === KanbanStatus.done),
  };
});
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-3 items-start p-2">
    <KanbanCard v-for="status in KanbanStatus" :variant="status" :key="status">
      <KanbanListItem
        v-for="item in groupedItems[status]"
        :key="item.id"
        @select="$emit('itemSelect', item)"
        @edit="$emit('itemEdit', item)"
        @delete="$emit('itemDelete', item)"
      >
        <template #title>
          <slot name="item-name" :item="item" />
        </template>
        <template #description>
          <slot name="item-description" :item="item" />
        </template>
        <template #badges>
          <slot name="item-badges" :item="item" />
        </template>
      </KanbanListItem>
    </KanbanCard>
  </div>
</template>
