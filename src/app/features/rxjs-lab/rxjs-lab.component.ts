import { Component, inject, signal, computed } from '@angular/core';
import { RxjsLabStateService } from './services/rxjs-lab-state.service';
import { RxjsConceptsSidebarComponent } from './components/rxjs-concepts-sidebar/rxjs-concepts-sidebar.component';

type Tab = 'stream' | 'lifecycle' | 'concurrency' | 'error-retry' | 'cold-hot';

@Component({
  selector: 'app-rxjs-lab',
  imports: [RxjsConceptsSidebarComponent],
  templateUrl: './rxjs-lab.component.html',
  styleUrl: './rxjs-lab.component.css',
})
export class RxjsLabComponent {
  readonly state = inject(RxjsLabStateService);
  readonly activeTab = signal<Tab>('stream');

  readonly codeStream = computed(() => {
    const values = this.state.streamSourceValues();
    const threshold = this.state.streamFilterThreshold();
    return `import { of } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';

of(${values}).pipe(
  tap(v => log('source', v)),
  map(v => v * 2),
  tap(v => log('after map', v)),
  filter(v => v > ${threshold})
).subscribe({
  complete: () => console.log('done')
});`;
  });

  readonly codeLifecycle = computed(() => {
    const delayMs = this.state.lifecycleDelayMs();
    return `import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

const source$ = of(1, 2, 3).pipe(
  delay(${delayMs})
);

const sub = source$.subscribe({
  next: v => console.log(v),
  complete: () => console.log('complete')
});

// Later: sub.unsubscribe(); cancels the subscription.`;
  });

  readonly codeConcurrency = computed(() => {
    const delayMs = this.state.concurrencyDelayMs();
    const op = this.state.concurrencyMode();
    return `import { Subject, of } from 'rxjs';
import { ${op}, delay } from 'rxjs/operators';

const clicks$ = new Subject<number>();

clicks$.pipe(
  ${op}(id => of(id).pipe(delay(${delayMs})))
).subscribe(v => console.log('emitted', v));

// Trigger: clicks$.next(1); clicks$.next(2); ...`;
  });

  readonly codeErrorRetry = computed(() => {
    const count = this.state.retryCount();
    return `import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

const source$ = new Observable<number>(sub => {
  sub.next(1);
  sub.next(2);
  sub.error(new Error('err'));
}).pipe(
  retry(${count})
);

source$.subscribe({
  next: v => console.log(v),
  error: e => console.log('error', e)
});`;
  });

  readonly codeColdHot = computed(() => {
    const values = this.state.coldHotValues();
    return `import { of } from 'rxjs';
import { share } from 'rxjs/operators';

// Cold: each subscriber triggers a new run
const cold$ = of(${values});
cold$.subscribe(a => logA(a));
cold$.subscribe(b => logB(b));

// Hot: one run shared by all
const hot$ = of(${values}).pipe(share());
hot$.subscribe(a => logA(a));
hot$.subscribe(b => logB(b));`;
  });

  formatArray(arr: number[]): string {
    return JSON.stringify(arr);
  }

  onStreamFilterInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    const n = parseInt(v, 10);
    if (!Number.isNaN(n)) this.state.streamFilterThreshold.set(n);
  }

  onLifecycleDelayInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    const n = parseInt(v, 10);
    if (!Number.isNaN(n) && n >= 0) this.state.lifecycleDelayMs.set(n);
  }

  onConcurrencyDelayInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    const n = parseInt(v, 10);
    if (!Number.isNaN(n) && n >= 0) this.state.setConcurrencyDelayMs(n);
  }

  onRetryCountInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    const n = parseInt(v, 10);
    if (!Number.isNaN(n) && n >= 0) this.state.retryCount.set(n);
  }
}
