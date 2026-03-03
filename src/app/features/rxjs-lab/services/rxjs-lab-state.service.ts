import { Injectable, signal } from '@angular/core';
import {
  Observable,
  of,
  Subscription,
  map,
  filter,
  tap,
  mergeMap,
  switchMap,
  delay,
  retry,
  share,
  Subject,
  defer,
} from 'rxjs';

export interface StreamEmission {
  id: number;
  value: number;
  time: string;
  stage: string;
}

export interface LifecycleEmission {
  id: number;
  value: number;
  time: string;
}

export interface ConcurrencyEmission {
  id: number;
  value: number;
  innerId: number;
  time: string;
}

export interface ErrorRetryEmission {
  id: number;
  type: 'next' | 'error' | 'retry';
  value?: number;
  time: string;
}

@Injectable({ providedIn: 'root' })
export class RxjsLabStateService {
  private nextId = 0;
  private streamSub: Subscription | null = null;
  private lifecycleSub: Subscription | null = null;
  private concurrencySub: Subscription | null = null;
  private errorRetrySub: Subscription | null = null;

  private formatTime(): string {
    return new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  // ── Tab 1: Stream + operators + timeline ───────────────────
  readonly streamEmissions = signal<StreamEmission[]>([]);
  readonly streamRunning = signal(false);
  readonly streamSourceValues = signal('1, 2, 3, 4, 5');
  readonly streamFilterThreshold = signal(4);

  private parseStreamSource(): number[] {
    const raw = this.streamSourceValues().trim();
    if (!raw) return [1, 2, 3, 4, 5];
    return raw.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !Number.isNaN(n));
  }

  startStream(): void {
    if (this.streamRunning()) return;
    this.streamRunning.set(true);
    const values = this.parseStreamSource();
    const threshold = this.streamFilterThreshold();
    const source = (values.length > 0 ? of(...values) : of(1, 2, 3, 4, 5)).pipe(
      tap((v) =>
        this.streamEmissions.update((log) => [
          ...log,
          { id: ++this.nextId, value: v, time: this.formatTime(), stage: 'source' },
        ])
      ),
      map((v) => v * 2),
      tap((v) =>
        this.streamEmissions.update((log) => [
          ...log,
          { id: ++this.nextId, value: v, time: this.formatTime(), stage: 'after map' },
        ])
      ),
      filter((v) => v > threshold),
      tap((v) =>
        this.streamEmissions.update((log) => [
          ...log,
          { id: ++this.nextId, value: v, time: this.formatTime(), stage: 'after filter' },
        ])
      )
    );
    this.streamSub = source.subscribe({
      complete: () => {
        this.streamRunning.set(false);
        this.streamSub = null;
      },
    });
  }

  stopStream(): void {
    this.streamSub?.unsubscribe();
    this.streamSub = null;
    this.streamRunning.set(false);
  }

  clearStream(): void {
    this.stopStream();
    this.streamEmissions.set([]);
  }

  // ── Tab 2: Subscription lifecycle ──────────────────────────
  readonly lifecycleEmissions = signal<LifecycleEmission[]>([]);
  readonly isSubscribed = signal(false);
  readonly subscribedAt = signal<string | null>(null);
  readonly unsubscribedAt = signal<string | null>(null);
  readonly lifecycleDelayMs = signal(100);

  private createLifecycleSource(): Observable<number> {
    return of(1, 2, 3).pipe(
      delay(this.lifecycleDelayMs()),
      tap((v) =>
        this.lifecycleEmissions.update((log) => [
          ...log,
          { id: ++this.nextId, value: v, time: this.formatTime() },
        ])
      )
    );
  }

  subscribeLifecycle(): void {
    if (this.isSubscribed()) return;
    this.lifecycleEmissions.set([]);
    this.isSubscribed.set(true);
    this.subscribedAt.set(this.formatTime());
    this.unsubscribedAt.set(null);
    this.lifecycleSub = this.createLifecycleSource().subscribe({
      complete: () => {
        this.isSubscribed.set(false);
        this.unsubscribedAt.set(this.formatTime());
        this.lifecycleSub = null;
      },
    });
  }

  unsubscribeLifecycle(): void {
    this.lifecycleSub?.unsubscribe();
    this.lifecycleSub = null;
    this.isSubscribed.set(false);
    this.unsubscribedAt.set(this.formatTime());
  }

  clearLifecycle(): void {
    this.unsubscribeLifecycle();
    this.lifecycleEmissions.set([]);
    this.subscribedAt.set(null);
    this.unsubscribedAt.set(null);
  }

  // ── Tab 3: Concurrency (mergeMap vs switchMap) ──────────────
  readonly concurrencyMode = signal<'mergeMap' | 'switchMap'>('mergeMap');
  readonly concurrencyEmissions = signal<ConcurrencyEmission[]>([]);
  readonly concurrencyTriggerCount = signal(0);

  private concurrencyClicks$ = new Subject<number>();

  constructor() {
    this.subscribeConcurrency();
  }

  readonly concurrencyDelayMs = signal(800);

  private subscribeConcurrency(): void {
    this.concurrencySub?.unsubscribe();
    const mode = this.concurrencyMode();
    const delayMs = this.concurrencyDelayMs();
    const stream = this.concurrencyClicks$.pipe(
      mode === 'mergeMap'
        ? mergeMap((id) => of(id).pipe(delay(delayMs)))
        : switchMap((id) => of(id).pipe(delay(delayMs)))
    );
    this.concurrencySub = stream.subscribe((value) =>
      this.concurrencyEmissions.update((log) => [
        ...log,
        {
          id: ++this.nextId,
          value,
          innerId: value,
          time: this.formatTime(),
        },
      ])
    );
  }

  triggerConcurrency(): void {
    const id = this.concurrencyTriggerCount() + 1;
    this.concurrencyTriggerCount.update((n) => n + 1);
    this.concurrencyClicks$.next(id);
  }

  setConcurrencyMode(mode: 'mergeMap' | 'switchMap'): void {
    this.concurrencyMode.set(mode);
    this.subscribeConcurrency();
  }

  setConcurrencyDelayMs(ms: number): void {
    this.concurrencyDelayMs.set(ms);
    this.subscribeConcurrency();
  }

  clearConcurrency(): void {
    this.concurrencyEmissions.set([]);
    this.concurrencyTriggerCount.set(0);
  }

  // ── Tab 4: Error + retry ───────────────────────────────────
  readonly errorRetryEmissions = signal<ErrorRetryEmission[]>([]);
  readonly errorRetryRunning = signal(false);
  readonly retryCount = signal(1);

  runErrorRetry(): void {
    if (this.errorRetryRunning()) return;
    this.errorRetryEmissions.set([]);
    this.errorRetryRunning.set(true);
    const count = Math.max(0, this.retryCount());
    const source$ = new Observable<number>((sub) => {
      sub.next(1);
      this.errorRetryEmissions.update((log) => [
        ...log,
        { id: ++this.nextId, type: 'next', value: 1, time: this.formatTime() },
      ]);
      sub.next(2);
      this.errorRetryEmissions.update((log) => [
        ...log,
        { id: ++this.nextId, type: 'next', value: 2, time: this.formatTime() },
      ]);
      sub.error(new Error('err'));
      this.errorRetryEmissions.update((log) => [
        ...log,
        { id: ++this.nextId, type: 'error', time: this.formatTime() },
      ]);
    }).pipe(retry(count));
    this.errorRetrySub = source$.subscribe({
      next: () => {},
      error: () => {
        this.errorRetryRunning.set(false);
        this.errorRetrySub = null;
      },
      complete: () => {
        this.errorRetryRunning.set(false);
        this.errorRetrySub = null;
      },
    });
  }

  clearErrorRetry(): void {
    this.errorRetrySub?.unsubscribe();
    this.errorRetrySub = null;
    this.errorRetryRunning.set(false);
    this.errorRetryEmissions.set([]);
  }

  // ── Tab 5: Cold vs hot ─────────────────────────────────────
  readonly coldLogA = signal<number[]>([]);
  readonly coldLogB = signal<number[]>([]);
  readonly hotLogA = signal<number[]>([]);
  readonly hotLogB = signal<number[]>([]);
  readonly coldHotValues = signal('1, 2, 3');
  readonly coldProducerRuns = signal(0);
  readonly hotProducerRuns = signal(0);

  private parseColdHotValues(): number[] {
    const raw = this.coldHotValues().trim();
    if (!raw) return [1, 2, 3];
    return raw.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !Number.isNaN(n));
  }

  runCold(): void {
    const values = this.parseColdHotValues();
    this.coldLogA.set([]);
    this.coldLogB.set([]);
    this.coldProducerRuns.set(0);
    const source$ = defer(() => {
      this.coldProducerRuns.update((n) => n + 1);
      return values.length > 0 ? of(...values) : of(1, 2, 3);
    });
    source$.subscribe((v) => this.coldLogA.update((arr) => [...arr, v]));
    source$.subscribe((v) => this.coldLogB.update((arr) => [...arr, v]));
  }

  runHot(): void {
    const values = this.parseColdHotValues();
    this.hotLogA.set([]);
    this.hotLogB.set([]);
    this.hotProducerRuns.set(0);
    const singleRun$ = defer(() => {
      this.hotProducerRuns.update((n) => n + 1);
      return values.length > 0 ? of(...values) : of(1, 2, 3);
    });
    const shared$ = singleRun$.pipe(delay(0), share());
    shared$.subscribe((v) => this.hotLogA.update((arr) => [...arr, v]));
    shared$.subscribe((v) => this.hotLogB.update((arr) => [...arr, v]));
  }

  clearColdHot(): void {
    this.coldLogA.set([]);
    this.coldLogB.set([]);
    this.hotLogA.set([]);
    this.hotLogB.set([]);
    this.coldProducerRuns.set(0);
    this.hotProducerRuns.set(0);
  }
}
