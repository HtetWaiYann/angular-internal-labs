import { Injectable, signal, computed, effect } from '@angular/core';

export interface EffectLogEntry {
  id: number;
  time: string;
  message: string;
}

export interface ComputedLogEntry {
  id: number;
  time: string;
  sourceValue: number;
  computedValue: number;
}

export interface BatchLogEntry {
  id: number;
  time: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class SignalsPlaygroundStateService {
  private nextId = 0;

  readonly effectLog = signal<EffectLogEntry[]>([]);
  readonly computedLog = signal<ComputedLogEntry[]>([]);
  readonly batchLog = signal<BatchLogEntry[]>([]);

  readonly sourceForEffect = signal(0);
  readonly sourceForComputed = signal(0);
  readonly computedFromSource = computed(
    () => this.sourceForComputed() * 2
  );

  readonly batchA = signal(0);
  readonly batchB = signal(0);

  readonly mutableArray = signal<number[]>([1, 2, 3]);
  readonly immutableArray = signal<number[]>([1, 2, 3]);
  readonly lastMutableUpdate = signal<string | null>(null);
  readonly lastImmutableUpdate = signal<string | null>(null);

  constructor() {
    effect(() => {
      const value = this.sourceForEffect();
      const time = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      this.effectLog.update((log) => [
        ...log,
        {
          id: ++this.nextId,
          time,
          message: `effect ran — source = ${value}`,
        },
      ]);
    });

    effect(() => {
      const sourceVal = this.sourceForComputed();
      const computedVal = this.computedFromSource();
      const time = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      this.computedLog.update((log) => [
        ...log,
        {
          id: ++this.nextId,
          time,
          sourceValue: sourceVal,
          computedValue: computedVal,
        },
      ]);
    });

    effect(() => {
      this.mutableArray();
      this.lastMutableUpdate.set(
        new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    });

    effect(() => {
      this.immutableArray();
      this.lastImmutableUpdate.set(
        new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    });

    effect(() => {
      const a = this.batchA();
      const b = this.batchB();
      const time = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      this.batchLog.update((log) => [
        ...log,
        {
          id: ++this.nextId,
          time,
          message: `effect ran — a = ${a}, b = ${b}`,
        },
      ]);
    });
  }

  updateBothInSameTick(): void {
    this.batchA.update((v) => v + 1);
    this.batchB.update((v) => v + 1);
  }

  incrementForEffect(): void {
    this.sourceForEffect.update((v) => v + 1);
  }

  incrementForComputed(): void {
    this.sourceForComputed.update((v) => v + 1);
  }

  mutateArray(): void {
    const arr = this.mutableArray();
    arr.push(arr.length + 1);
    this.mutableArray.set(arr);
  }

  updateArrayImmutable(): void {
    this.immutableArray.update((arr) => [...arr, arr.length + 1]);
  }

  clearEffectLog(): void {
    this.effectLog.set([]);
    this.sourceForEffect.set(0);
  }

  clearComputedLog(): void {
    this.computedLog.set([]);
    this.sourceForComputed.set(0);
  }

  clearMutationDemo(): void {
    this.mutableArray.set([1, 2, 3]);
    this.immutableArray.set([1, 2, 3]);
    this.lastMutableUpdate.set(null);
    this.lastImmutableUpdate.set(null);
  }

  clearBatchLog(): void {
    this.batchLog.set([]);
    this.batchA.set(0);
    this.batchB.set(0);
  }
}
