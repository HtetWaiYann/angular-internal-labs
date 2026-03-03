import { Component, inject, signal } from '@angular/core';
import { SignalsPlaygroundStateService } from './services/signals-playground-state.service';
import { SignalsConceptsSidebarComponent } from './components/signals-concepts-sidebar/signals-concepts-sidebar.component';

type Tab = 'effect' | 'computed' | 'batching' | 'mutation';

@Component({
  selector: 'app-signals-playground',
  imports: [SignalsConceptsSidebarComponent],
  templateUrl: './signals-playground.component.html',
  styleUrl: './signals-playground.component.css',
})
export class SignalsPlaygroundComponent {
  readonly state = inject(SignalsPlaygroundStateService);
  readonly activeTab = signal<Tab>('effect');

  readonly code: Record<Tab, string> = {
    effect:
      `const source = signal(0);\n` +
      `\n` +
      `effect(() => {\n` +
      `  console.log('effect ran', source());\n` +
      `});\n` +
      `\n` +
      `// Updating source() schedules the effect.\n` +
      `// Each run is logged above.`,

    computed:
      `const source = signal(0);\n` +
      `const doubled = computed(() => source() * 2);\n` +
      `\n` +
      `effect(() => {\n` +
      `  console.log('computed is', doubled());\n` +
      `});\n` +
      `\n` +
      `// When source changes, computed recalculates\n` +
      `// and the effect runs.`,

    batching:
      `const a = signal(0);\n` +
      `const b = signal(0);\n` +
      `\n` +
      `effect(() => {\n` +
      `  console.log('effect ran', a(), b());\n` +
      `});\n` +
      `\n` +
      `// Updating both in the same synchronous block:\n` +
      `a.update(n => n + 1);\n` +
      `b.update(n => n + 1);\n` +
      `// → Effect runs once (batched).`,

    mutation:
      `const arr = signal([1, 2, 3]);\n` +
      `\n` +
      `// Mutate (same reference) — signal does not notify:\n` +
      `arr.update(a => { a.push(4); return a; });\n` +
      `\n` +
      `// Immutable (new reference) — signal notifies:\n` +
      `arr.update(a => [...a, 4]);\n` +
      `\n` +
      `// Only the second triggers effects/views.`,
  };

  formatArray(arr: number[]): string {
    return JSON.stringify(arr);
  }
}
