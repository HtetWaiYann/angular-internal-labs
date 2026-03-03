import { Component, input, computed } from '@angular/core';

export type SignalsTab = 'effect' | 'computed' | 'batching' | 'mutation';

@Component({
  selector: 'app-signals-concepts-sidebar',
  standalone: true,
  templateUrl: './signals-concepts-sidebar.component.html',
  styleUrl: './signals-concepts-sidebar.component.css',
})
export class SignalsConceptsSidebarComponent {
  readonly activeTab = input<SignalsTab>('effect');

  readonly tabLabel = computed(() => {
    const t = this.activeTab();
    if (t === 'effect') return 'Effect log';
    if (t === 'computed') return 'Computed';
    if (t === 'batching') return 'Batching';
    return 'Mutation vs immutable';
  });
}
