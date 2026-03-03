import { Component, inject, signal, computed } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RxjsLab2StateService } from './services/rxjs-lab-2-state.service';
import { RxjsLab2ConceptsSidebarComponent } from './components/rxjs-lab-2-concepts-sidebar/rxjs-lab-2-concepts-sidebar.component';

type Tab = 'filter-distinct' | 'search' | 'catch-error' | 'take' | 'combine' | 'angular';

@Component({
  selector: 'app-rxjs-lab-2',
  imports: [AsyncPipe, RxjsLab2ConceptsSidebarComponent],
  templateUrl: './rxjs-lab-2.component.html',
  styleUrl: './rxjs-lab-2.component.css',
})
export class RxjsLab2Component {
  readonly state = inject(RxjsLab2StateService);
  readonly activeTab = signal<Tab>('filter-distinct');

  readonly codeFilterDistinct = computed(() => {
    const th = this.state.filterDistinctThreshold();
    return `of(1, 2, 2, 3, 5, 5, 6, 6, 6).pipe(
  map(v => v * 2),
  filter(v => v > ${th}),
  distinctUntilChanged()
).subscribe(v => log(v));
// distinctUntilChanged() emits only when value !== previous.`;
  });

  readonly codeSearch = computed(() => {
    const ms = this.state.searchDebounceMs();
    return `searchInput$.pipe(
  debounceTime(${ms}),
  switchMap(q => fetchResults(q))
).subscribe(results => ...);
// debounceTime: wait for pause in input.
// switchMap: cancel previous request when new query.`;
  });

  readonly codeCatchError = computed(() => {
    const fb = this.state.catchErrorFallback();
    return `source$.pipe(
  catchError(() => of('${fb}'))
).subscribe(...);
// Stream continues with fallback instead of breaking.`;
  });

  readonly codeTake = `// take(1): one value then complete (e.g. one-off config).
of('a','b','c').pipe(take(1)).subscribe(...);

// takeUntil(destroy$): complete when destroy$ emits (e.g. ngOnDestroy).
interval(500).pipe(takeUntil(destroy$)).subscribe(...);`;

  readonly codeCombine = computed(() => {
    return `combineLatest([a$, b$]).subscribe(([a, b]) => ...);
// Emits whenever any source emits (with latest from all).`;
  });

  readonly codeAngular = `// Template: async pipe (auto subscribe/unsubscribe)
<div>{{ count$ | async }}</div>

// Service: BehaviorSubject for state
private state = new BehaviorSubject('initial');
readonly state$ = this.state.asObservable();
update(v: string) { this.state.next(v); }`;

  onThresholdInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    const n = parseInt(v, 10);
    if (!Number.isNaN(n)) this.state.filterDistinctThreshold.set(n);
  }

  onSearchDebounceInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    const n = parseInt(v, 10);
    if (!Number.isNaN(n) && n >= 0) this.state.searchDebounceMs.set(n);
  }
}
