import { Component, inject } from '@angular/core';
import { DiTraceService } from '../../services/di-trace.service';
import { DemoLoggerService } from '../../services/demo-logger.service';
import { DiTracingDemoComponent } from '../di-tracing-demo/di-tracing-demo.component';

@Component({
  selector: 'app-injection-tracing-view',
  imports: [DiTracingDemoComponent],
  templateUrl: './injection-tracing-view.component.html',
  styleUrl: './injection-tracing-view.component.css',
})
export class InjectionTracingViewComponent {
  readonly traceService = inject(DiTraceService);
  readonly trace = this.traceService.trace;
}
