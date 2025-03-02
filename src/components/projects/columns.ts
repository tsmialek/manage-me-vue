import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';

import type { Project } from '@/components/projects/types';

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'text-right' }, 'Id'),
    cell: ({ row }) => {
      const projectId = Number.parseInt(row.getValue('id'));
      return h('div', { class: 'text-right font-medium' }, projectId);
    },
  },
  {
    accessorKey: 'title',
    header: () => h('div', { class: 'text-right' }, 'Title'),
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right font-medium' },
        row.getValue('title')
      );
    },
  },
  {
    accessorKey: 'description',
    header: () => h('div', { class: 'text-right' }, 'Description'),
    cell: ({ row }) => {
      const rawDescription = row.getValue('description') as String;
      const shortenedDescription = rawDescription
        .split(' ')
        .slice(0, 6)
        .join(' ');

      return h(
        'div',
        { class: 'text-right font-medium' },
        shortenedDescription
      );
    },
  },
];
