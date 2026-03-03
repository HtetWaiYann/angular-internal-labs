import { Component, input, computed } from '@angular/core';

export type RxjsTab = 'stream' | 'lifecycle' | 'concurrency' | 'error-retry' | 'cold-hot';

@Component({
  selector: 'app-rxjs-concepts-sidebar',
  standalone: true,
  templateUrl: './rxjs-concepts-sidebar.component.html',
  styleUrl: './rxjs-concepts-sidebar.component.css',
})
export class RxjsConceptsSidebarComponent {
  readonly activeTab = input<RxjsTab>('stream');

  readonly tabLabel = computed(() => {
    const t = this.activeTab();
    if (t === 'stream') return 'Stream + timeline';
    if (t === 'lifecycle') return 'Subscription';
    if (t === 'concurrency') return 'Concurrency';
    if (t === 'error-retry') return 'Error + retry';
    return 'Cold vs hot';
  });
}
