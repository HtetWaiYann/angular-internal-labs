import {
  Component,
  inject,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TrackByLabStateService } from '../../services/track-by-lab-state.service';
import type { TrackByItem } from '../../services/track-by-lab-state.service';

@Component({
  selector: 'app-track-by-list-item',
  standalone: true,
  template: `
    <div class="track-by-item">
      <span class="track-by-item-name">{{ item.name }}</span>
      <span class="track-by-item-id">id: {{ item.id }}</span>
      <span class="track-by-item-badge" [class.track-by-item-badge--new]="isNew">
        {{ isNew ? 'NEW' : 'reused' }}
      </span>
    </div>
  `,
  styles: `
    .track-by-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0.875rem;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: var(--bg-panel);
      font-size: 0.875rem;
    }

    .track-by-item-name {
      font-weight: 600;
      color: var(--text-primary);
      min-width: 100px;
    }

    .track-by-item-id {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .track-by-item-badge {
      margin-left: auto;
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      background: color-mix(in srgb, var(--text-muted) 20%, transparent);
      color: var(--text-muted);
    }

    .track-by-item-badge--new {
      background: color-mix(in srgb, var(--color-accent) 20%, transparent);
      color: var(--color-accent);
      animation: track-by-badge-pulse 0.5s ease-out;
    }

    @keyframes track-by-badge-pulse {
      0% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `,
})
export class TrackByListItemComponent implements OnInit, OnChanges {
  private readonly state = inject(TrackByLabStateService);

  @Input({ required: true }) item!: TrackByItem;
  @Input({ required: true }) listId!: 'no-track' | 'with-track';

  isNew = true;

  ngOnInit(): void {
    this.state.recordCreation(this.listId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && !changes['item'].firstChange) {
      this.isNew = false;
    }
  }
}
