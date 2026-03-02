import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CdLabStateService {
  /** Shared signal — only the Signal-strategy component reads this in its template. */
  readonly sharedSignal = signal(0);
}
