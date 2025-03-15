<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast/use-toast';
import { h } from 'vue';
import * as z from 'zod';

const { toast } = useToast();

const schema = z.object({
  title: z.string(),
  description: z.string(),
});

function onSubmit(values: Record<string, any>) {
  console.log(values);
  toast({
    title: 'You submitted the following values:',
    description: h(
      'pre',
      { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
      h('div', { class: 'text-white' }, JSON.stringify(values, null, 2))
    ),
  });
}
</script>

<template>
  <AutoForm class="space-y-6" :schema="schema" @submit="onSubmit">
    <Button type="submit">Submit</Button>
  </AutoForm>
</template>
