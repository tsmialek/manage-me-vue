import { BasePocketBaseService } from '@/services/BasePocketBaseService';
import type { NewStory, StoryRecord } from '@/types';

class StoryService extends BasePocketBaseService<NewStory, StoryRecord> {
  constructor() {
    super('stories');
  }
}

export default new StoryService();
