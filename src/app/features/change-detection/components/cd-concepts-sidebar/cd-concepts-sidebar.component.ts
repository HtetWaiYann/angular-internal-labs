import { Component, input } from '@angular/core';

export type CdTab = 'default' | 'onpush' | 'signal';

@Component({
  selector: 'app-cd-concepts-sidebar',
  standalone: true,
  templateUrl: './cd-concepts-sidebar.component.html',
  styleUrl: './cd-concepts-sidebar.component.css',
})
export class CdConceptsSidebarComponent {
  readonly activeTab = input<CdTab>('default');
}
