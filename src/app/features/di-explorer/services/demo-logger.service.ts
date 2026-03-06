import { Injectable, inject } from '@angular/core';
import { DiTraceService } from './di-trace.service';

@Injectable({ providedIn: 'root' })
export class DemoLoggerService {
  private readonly trace = inject(DiTraceService);

  readonly message = 'DemoLoggerService instance (root)';

  constructor() {
    this.trace.log('LoggerService constructor called — instance created', 'create');
  }

  log(msg: string): void {
    this.trace.log(`logger.log("${msg}")`, 'return');
  }
}
