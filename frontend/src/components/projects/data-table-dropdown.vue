<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-vue-next';
import { ProjectForm } from '@/components/projects';

import type { ProjectRecord } from '@/types';
import { useProjectStore, useAppStore } from '@/store';

const projectStore = useProjectStore();
const appStore = useAppStore();

defineProps<{
  project: ProjectRecord;
}>();

function onUpdateProject(project: ProjectRecord) {
  appStore.openModal('update-project', ProjectForm, 'Update Project', {
    project: project,
  });
}

function copy(id: string) {
  navigator.clipboard.writeText(id);
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child @click.stop>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem @click="copy(project.id)">
        Copy project id
      </DropdownMenuItem>
      <DropdownMenuItem @click="onUpdateProject(project)">
        Update project
      </DropdownMenuItem>
      <DropdownMenuItem @click="projectStore.deleteProject(project)">
        Delete project
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
