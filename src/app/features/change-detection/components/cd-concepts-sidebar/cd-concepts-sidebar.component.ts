import { Component, computed, input } from '@angular/core';

export type CdTab = 'default' | 'onpush' | 'signal' | 'compare';

@Component({
  selector: 'app-cd-concepts-sidebar',
  standalone: true,
  templateUrl: './cd-concepts-sidebar.component.html',
  styleUrl: './cd-concepts-sidebar.component.css',
})
export class CdConceptsSidebarComponent {
  readonly activeTab = input<CdTab>('default');

  readonly tabLabel = computed(() => {
    const t = this.activeTab();
    if (t === 'default') return 'Default';
    if (t === 'onpush') return 'OnPush';
    if (t === 'signal') return 'Signal';
    return 'Compare';
  });
}
