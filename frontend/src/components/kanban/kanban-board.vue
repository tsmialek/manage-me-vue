<script setup lang="ts" generic="T extends KanbanItem">
import { computed } from 'vue';

import { KanbanStatus } from '@/types';
import type { KanbanItem } from '@/types';

import { KanbanCard } from '.';
import KanbanListItem from './kanban-list-item.vue';

const props = defineProps<{
  items: T[];
}>();

const emit = defineEmits(['itemClick', 'itemEdit', 'itemDelete']);

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
    <KanbanCard variant="todo">
      <template v-slot:title>ToDo</template>
      <template v-slot:content>
        <KanbanListItem
          v-for="item in groupedItems.todo"
          :key="item.id"
          :item="item"
          :owner="item.expand?.owner?.name"
          :performer="item.expand?.performer?.name"
          @click="$emit('itemClick', item)"
          @edit="$emit('itemEdit', item)"
          @delete="$emit('itemDelete', item)"
        />
      </template>
    </KanbanCard>

    <KanbanCard variant="doing">
      <template v-slot:title>Doing</template>
      <template v-slot:content>
        <KanbanListItem
          v-for="item in groupedItems.doing"
          :key="item.id"
          :item="item"
          :owner="item.expand?.owner?.name"
          :performer="item.expand?.performer?.name"
          @click="$emit('itemClick', item)"
          @edit="$emit('itemEdit', item)"
          @delete="$emit('itemDelete', item)"
        />
      </template>
    </KanbanCard>

    <KanbanCard variant="done">
      <template v-slot:title>Done</template>
      <template v-slot:content>
        <KanbanListItem
          v-for="item in groupedItems.done"
          :key="item.id"
          :item="item"
          :owner="item.expand?.owner?.name"
          :performer="item.expand?.performer?.name"
          @click="$emit('itemClick', item)"
          @edit="$emit('itemEdit', item)"
          @delete="$emit('itemDelete', item)"
        />
      </template>
    </KanbanCard>
  </div>
</template>
