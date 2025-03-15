import type { ColumnDef } from '@tanstack/vue-table';
import DropdownAction from '@/components/projects/data-table-dropdown.vue';
import { h } from 'vue';

import type { ProjectRecord } from '@/types';

export const columns = (
  emit: (event: string, payload: ProjectRecord) => void
): ColumnDef<ProjectRecord>[] => [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'text-left' }, 'Id'),
    cell: ({ row }) => {
      const rawProjectId = row.getValue('id') as string;
      return h('div', { class: 'text-left font-medium' }, rawProjectId);
    },
  },
  {
    accessorKey: 'title',
    header: () => h('div', { class: 'text-right' }, 'Title'),
    cell: ({ row }) => {
      const rawTitle = row.getValue('title') as string;
      return h('div', { class: 'text-right font-medium' }, rawTitle);
    },
  },
  {
    accessorKey: 'description',
    header: () => h('div', { class: 'text-right' }, 'Description'),
    cell: ({ row }) => {
      const rawDescription = row.getValue('description') as string;
      const shortenedDescription = rawDescription
        .split(' ')
        .slice(0, 6)
        .join(' ')
        .concat(' ...');

      return h(
        'div',
        { class: 'text-right font-medium' },
        shortenedDescription
      );
    },
  },
  {
    accessorKey: 'user',
    header: () => h('div', { class: 'text-right' }, 'User'),
    cell: ({ row }) => {
      const user =
        row.original.expand?.user.map(user => user.name).join(', ') ?? '---';
      return h('div', { class: 'text-right' }, user);
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original;
      return h(
        'div',
        { class: 'relative' },
        h(DropdownAction, {
          project,
          onDeleteProject: (project: ProjectRecord) =>
            emit('delete-project', project),
        })
      );
    },
  },
];
