import { Injectable, signal } from '@angular/core';

export interface TrackByItem {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class TrackByLabStateService {
  readonly items = signal<TrackByItem[]>([]);
  readonly noTrackCreations = signal(0);
  readonly withTrackCreations = signal(0);

  private noTrackCount = 0;
  private withTrackCount = 0;

  recordCreation(listId: 'no-track' | 'with-track'): void {
    if (listId === 'no-track') {
      this.noTrackCount++;
      this.noTrackCreations.set(this.noTrackCount);
    } else {
      this.withTrackCount++;
      this.withTrackCreations.set(this.withTrackCount);
    }
  }

  reset(): void {
    this.noTrackCount = 0;
    this.withTrackCount = 0;
    this.noTrackCreations.set(0);
    this.withTrackCreations.set(0);
  }

  initItems(): void {
    this.items.set([
      { id: 1, name: 'Apple' },
      { id: 2, name: 'Banana' },
      { id: 3, name: 'Cherry' },
      { id: 4, name: 'Date' },
      { id: 5, name: 'Elderberry' },
    ]);
  }

  addItem(): void {
    const current = this.items();
    const nextId = current.length > 0 ? Math.max(...current.map((i) => i.id)) + 1 : 1;
    this.items.set([...current, { id: nextId, name: `Item ${nextId}` }]);
  }

  reorder(): void {
    const current = this.items();
    if (current.length < 2) return;
    const [first, ...rest] = current;
    this.items.set([...rest, first]);
  }

  updateFirst(): void {
    const current = this.items();
    if (current.length === 0) return;
    const updated = [...current];
    updated[0] = { ...updated[0], name: `${updated[0].name} (updated)` };
    this.items.set(updated);
  }

  refresh(): void {
    const current = this.items();
    this.items.set(
      current.map((i) => ({ id: i.id, name: i.name }))
    );
  }
}
