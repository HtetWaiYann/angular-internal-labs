import { Component, input } from '@angular/core';

export type SignalsTab = 'effect' | 'computed' | 'mutation';

@Component({
  selector: 'app-signals-concepts-sidebar',
  standalone: true,
  templateUrl: './signals-concepts-sidebar.component.html',
  styleUrl: './signals-concepts-sidebar.component.css',
})
export class SignalsConceptsSidebarComponent {
  readonly activeTab = input<SignalsTab>('effect');
}
