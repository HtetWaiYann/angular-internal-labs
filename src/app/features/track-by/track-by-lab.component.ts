import { Component, inject, OnInit, signal } from '@angular/core';
import { TrackByLabStateService } from './services/track-by-lab-state.service';
import { TrackByListItemComponent } from './components/track-by-list-item/track-by-list-item.component';
import { TrackByConceptsSidebarComponent } from './components/track-by-concepts-sidebar/track-by-concepts-sidebar.component';
import { TooltipDirective } from '../../shared/directives/tooltip';

@Component({
  selector: 'app-track-by-lab',
  imports: [
    TrackByListItemComponent,
    TrackByConceptsSidebarComponent,
    TooltipDirective,
  ],
  templateUrl: './track-by-lab.component.html',
  styleUrl: './track-by-lab.component.css',
})
export class TrackByLabComponent implements OnInit {
  readonly state = inject(TrackByLabStateService);
  readonly lastAction = signal<'add' | 'reorder' | 'update' | 'refresh' | null>(null);

  ngOnInit(): void {
    this.state.initItems();
  }

  addItem(): void {
    this.state.addItem();
    this.lastAction.set('add');
  }

  reorder(): void {
    this.state.reorder();
    this.lastAction.set('reorder');
  }

  updateFirst(): void {
    this.state.updateFirst();
    this.lastAction.set('update');
  }

  refresh(): void {
    this.state.refresh();
    this.lastAction.set('refresh');
  }

  reset(): void {
    this.state.reset();
    this.state.initItems();
    this.lastAction.set(null);
  }
}
