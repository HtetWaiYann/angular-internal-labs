import { Injectable, signal } from '@angular/core';
import {
  Observable,
  of,
  Subject,
  BehaviorSubject,
  Subscription,
  map,
  filter,
  distinctUntilChanged,
  debounceTime,
  switchMap,
  catchError,
  takeUntil,
  take,
  combineLatest,
  delay,
  tap,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RxjsLab2StateService {

  // ── Tab: map / filter / distinctUntilChanged ──────────────
  readonly filterDistinctLog = signal<string[]>([]);
  readonly filterDistinctThreshold = signal(5);
  readonly filterDistinctSource = signal('1, 2, 2, 3, 5, 5, 6, 6, 6');

  runFilterDistinct(): void {
    this.filterDistinctLog.set([]);
    const th = this.filterDistinctThreshold();
    const parts = this.filterDistinctSource().split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !Number.isNaN(n));
    const source$ = parts.length > 0 ? of(...parts) : of(1, 2, 2, 3, 5, 5, 6, 6, 6);
    source$
      .pipe(
        map((v) => v * 2),
        filter((v) => v > th),
        distinctUntilChanged(),
        tap((v) => this.filterDistinctLog.update((log) => [...log, `emitted ${v}`]))
      )
      .subscribe();
  }

  clearFilterDistinct(): void {
    this.filterDistinctLog.set([]);
  }

  // ── Tab: switchMap + debounceTime ──────────────────────────
  readonly searchQuery = signal('');
  readonly searchDebounceMs = signal(300);
  readonly searchResults = signal<string[]>([]);
  readonly searchLog = signal<string[]>([]);

  private searchSubject = new Subject<string>();
  private searchSub: Subscription | null = null;

  startSearch(): void {
    this.searchResults.set([]);
    this.searchLog.set([]);
    this.searchSub?.unsubscribe();
    const ms = this.searchDebounceMs();
    this.searchSub = this.searchSubject
      .pipe(
        tap((q) => this.searchLog.update((l) => [...l, `query: "${q}"`])),
        debounceTime(ms),
        switchMap((q) => of(`Result for "${q}"`).pipe(delay(400))),
        tap((r) => this.searchResults.update((arr) => [...arr, r]))
      )
      .subscribe();
  }

  triggerSearch(): void {
    this.searchSubject.next(this.searchQuery());
  }

  clearSearch(): void {
    this.searchSub?.unsubscribe();
    this.searchSub = null;
    this.searchResults.set([]);
    this.searchLog.set([]);
  }

  // ── Tab: catchError ───────────────────────────────────────
  readonly catchErrorLog = signal<string[]>([]);
  readonly catchErrorFallback = signal('fallback value');

  runCatchError(): void {
    this.catchErrorLog.set([]);
    const fallback = this.catchErrorFallback();
    new Observable<string>((sub) => {
      this.catchErrorLog.update((l) => [...l, 'source: next(a)']);
      sub.next('a');
      this.catchErrorLog.update((l) => [...l, 'source: next(b)']);
      sub.next('b');
      this.catchErrorLog.update((l) => [...l, 'source: error']);
      sub.error(new Error('fail'));
    })
      .pipe(
        catchError(() => {
          this.catchErrorLog.update((l) => [...l, `catchError: emit "${fallback}"`]);
          return of(fallback);
        }),
        tap((v) => this.catchErrorLog.update((l) => [...l, `subscriber received: ${v}`]))
      )
      .subscribe();
  }

  clearCatchError(): void {
    this.catchErrorLog.set([]);
  }

  // ── Tab: takeUntil / take(1) ───────────────────────────────
  readonly takeOneLog = signal<string[]>([]);
  readonly takeUntilLog = signal<string[]>([]);
  readonly takeUntilDestroyed = signal(false);

  runTakeOne(): void {
    this.takeOneLog.set([]);
    of('first', 'second', 'third')
      .pipe(
        take(1),
        tap((v) => this.takeOneLog.update((l) => [...l, `received: ${v}, then completed`]))
      )
      .subscribe();
  }

  runTakeUntil(): void {
    this.takeUntilLog.set([]);
    this.takeUntilDestroyed.set(false);
    const destroy$ = new Subject<void>();
    const interval$ = new Observable<number>((sub) => {
      let i = 0;
      const id = setInterval(() => {
        sub.next(i++);
        this.takeUntilLog.update((l) => [...l, `tick ${i - 1}`]);
      }, 500);
      return () => {
        clearInterval(id);
        this.takeUntilLog.update((l) => [...l, 'unsubscribed (takeUntil)']);
      };
    });
    interval$.pipe(takeUntil(destroy$)).subscribe();
    setTimeout(() => {
      destroy$.next();
      destroy$.complete();
      this.takeUntilDestroyed.set(true);
    }, 2000);
  }

  clearTake(): void {
    this.takeOneLog.set([]);
    this.takeUntilLog.set([]);
    this.takeUntilDestroyed.set(false);
  }

  // ── Tab: combineLatest ────────────────────────────────────
  readonly combineSourceA = signal(1);
  readonly combineSourceB = signal(10);
  readonly combineLog = signal<string[]>([]);

  private combineA$ = new BehaviorSubject<number>(1);
  private combineB$ = new BehaviorSubject<number>(10);
  private combineSub: Subscription | null = null;

  startCombineLatest(): void {
    this.combineLog.set([]);
    this.combineSub?.unsubscribe();
    this.combineA$.next(this.combineSourceA());
    this.combineB$.next(this.combineSourceB());
    this.combineSub = combineLatest([this.combineA$, this.combineB$])
      .pipe(tap(([a, b]) => this.combineLog.update((l) => [...l, `[${a}, ${b}]`])))
      .subscribe();
  }

  emitCombineA(): void {
    const v = this.combineSourceA() + 1;
    this.combineSourceA.set(v);
    this.combineA$.next(v);
  }

  emitCombineB(): void {
    const v = this.combineSourceB() + 1;
    this.combineSourceB.set(v);
    this.combineB$.next(v);
  }

  clearCombine(): void {
    this.combineSub?.unsubscribe();
    this.combineSub = null;
    this.combineLog.set([]);
  }

  // ── Tab: Angular (async pipe + BehaviorSubject) ────────────
  private readonly countSubject = new BehaviorSubject(0);
  private readonly stateSubject = new BehaviorSubject<string>('initial');

  readonly count$ = this.countSubject.asObservable();
  readonly state$ = this.stateSubject.asObservable();

  incrementAsync(): void {
    this.countSubject.next(this.countSubject.value + 1);
  }

  setStateValue(v: string): void {
    this.stateSubject.next(v);
  }

  get countValue(): number {
    return this.countSubject.value;
  }

  get stateValue(): string {
    return this.stateSubject.value;
  }
}
