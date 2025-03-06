import { createApp } from 'vue';
import './index.css';
import App from './App.vue';

import type { ProjectRepository } from '@/repositories/ProjectRepository';
import { JsonProjectRepository } from '@/repositories/JsonProjectRepository';
import { ApiProjectRepository } from '@/repositories/ApiProjectRepository';

const useJsonData = true;
const projectRepository: ProjectRepository = useJsonData
  ? new JsonProjectRepository('/src/assets/projects.json')
  : new ApiProjectRepository('');

const app = createApp(App);

app.provide('project-repository', projectRepository);
app.mount('#app');
