<script lang="ts" setup>
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  CalendarCellTrigger,
  type CalendarCellTriggerProps,
  useForwardProps,
} from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';

const props = defineProps<
  CalendarCellTriggerProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <CalendarCellTrigger
    :class="
      cn(
        buttonVariants({ variant: 'ghost' }),
        'h-8 w-8 p-0 font-normal',
        '[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground',
        'data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:opacity-100 data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground',
        'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
        'data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through',
        'data-[outside-view]:text-muted-foreground data-[outside-view]:opacity-50 [&[data-outside-view][data-selected]]:bg-accent/50 [&[data-outside-view][data-selected]]:text-muted-foreground [&[data-outside-view][data-selected]]:opacity-30',
        props.class
      )
    "
    v-bind="forwardedProps"
  >
    <slot />
  </CalendarCellTrigger>
</template>
