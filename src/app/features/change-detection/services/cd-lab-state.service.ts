import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CdLabStateService {
  readonly sharedSignal = signal(0);
}
