import { Injectable, signal } from '@angular/core';

export interface TraceEntry {
  id: number;
  time: number;
  message: string;
  type: 'request' | 'lookup' | 'create' | 'return';
}

@Injectable({ providedIn: 'root' })
export class DiTraceService {
  private readonly entries = signal<TraceEntry[]>([]);
  private nextId = 0;
  private startTime = 0;

  readonly trace = this.entries.asReadonly();

  clear(): void {
    this.entries.set([]);
    this.nextId = 0;
  }

  log(message: string, type: TraceEntry['type']): void {
    const now = performance.now();
    if (this.entries().length === 0) {
      this.startTime = now;
    }
    const elapsed = ((now - this.startTime) / 1000).toFixed(3);
    this.entries.update((list) => [
      ...list,
      {
        id: this.nextId++,
        time: parseFloat(elapsed),
        message,
        type,
      },
    ]);
  }
}
