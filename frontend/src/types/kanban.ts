export enum KanbanPriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export enum KanbanStatus {
  todo = 'todo',
  doing = 'doing',
  done = 'done',
}

export type KanbanItem = {
  id: string;
  status: KanbanStatus;
};

export type TransitionFrom = KanbanStatus | '*';
export type TransitionTo = KanbanStatus | '*';
export interface KanbanTransition<T extends KanbanItem> {
  from: TransitionFrom;
  to: TransitionTo;
  conditions?: (_task: T, updates: Partial<T>) => boolean;
  effects?: (_task: T, updates: Partial<T>) => Partial<T>;
  validationMessage?: string;
}

export type ValidationResult = {
  isValid: boolean;
  reason?: string;
};
export class KanbanTransitionManager<T extends KanbanItem> {
  constructor(private readonly transitions: Readonly<KanbanTransition<T>[]>) {}

  processUpdates(currentTask: T, updates: Partial<T>): Partial<T> {
    let finalUpdates = { ...updates };
    const applicableTransition = this.findMatchingTransition(
      currentTask,
      updates
    );

    if (applicableTransition && applicableTransition.effects) {
      finalUpdates = applicableTransition.effects(currentTask, finalUpdates);
      let transitionName = this.getTransitionByName(
        applicableTransition.from,
        applicableTransition.to
      );
      console.log({ transitionName }, finalUpdates);
    }

    return finalUpdates;
  }

  canTransition(currentTask: T, updates: Partial<T>): ValidationResult {
    const applicableTransition = this.findMatchingTransition(
      currentTask,
      updates
    );

    console.log('Applicable transition: ', applicableTransition);
    if (applicableTransition?.validationMessage) {
      return { isValid: false, reason: applicableTransition.validationMessage };
    }
    if (applicableTransition) {
      return { isValid: true };
    }

    return {
      isValid: false,
      reason: `Cannot transition from ${currentTask.status} with these updates`,
    };
  }

  private findMatchingTransition(
    currentTask: T,
    updates: Partial<T>
  ): KanbanTransition<T> | undefined {
    const applicableTransition = this.transitions.find(transition => {
      const fromMatches =
        transition.from === '*' || transition.from === currentTask.status;
      const conditionsMet =
        !transition.conditions || transition.conditions(currentTask, updates);

      return fromMatches && conditionsMet;
    });

    return applicableTransition;
  }

  getAvailableTransitions(currentTask: T): KanbanStatus[] {
    return this.transitions
      .filter(t => t.from === '*' || t.from === currentTask.status)
      .map(t => t.to)
      .filter(to => to !== '*') as KanbanStatus[];
  }

  getTransitionByName(
    fromStatus: TransitionFrom,
    toStatus: TransitionFrom
  ): KanbanTransition<T> | undefined {
    return this.transitions.find(
      t => t.from === fromStatus && t.to === toStatus
    );
  }

  getTransitionsFrom(status: KanbanStatus): KanbanTransition<T>[] {
    return this.transitions.filter(t => t.from === status || t.from === '*');
  }

  getTransitionsTo(status: KanbanStatus): KanbanTransition<T>[] {
    return this.transitions.filter(t => t.to === status);
  }
}
