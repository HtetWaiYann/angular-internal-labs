import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RouterLabConfigService {
  readonly guardDelayMs = signal<number>(0);
  readonly resolverDelayMs = signal<number>(0);
}
