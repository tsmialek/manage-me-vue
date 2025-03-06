import type { ColumnDef } from '@tanstack/vue-table';
import DropdownAction from '@/components/projects/data-table-dropdown.vue';
import { h } from 'vue';

import type { Project } from '@/components/projects/types';

export const columns = (
  emit: (event: string, payload: Project) => void
): ColumnDef<Project>[] => [
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
        .join(' ');

      return h(
        'div',
        { class: 'text-right font-medium' },
        shortenedDescription
      );
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
          onDeleteProject: (project: Project) =>
            emit('delete-project', project),
        })
      );
    },
  },
];
