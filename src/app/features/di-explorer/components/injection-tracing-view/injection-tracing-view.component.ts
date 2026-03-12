import { Component, inject } from '@angular/core';
import { DiTraceService } from '../../services/di-trace.service';
import { DiTracingDemoComponent } from '../di-tracing-demo/di-tracing-demo.component';
import { TooltipDirective } from '../../../../shared/directives/tooltip';

@Component({
  selector: 'app-injection-tracing-view',
  standalone: true,
  imports: [DiTracingDemoComponent, TooltipDirective],
  templateUrl: './injection-tracing-view.component.html',
  styleUrl: './injection-tracing-view.component.css',
})
export class InjectionTracingViewComponent {
  readonly traceService = inject(DiTraceService);
  readonly trace = this.traceService.trace;
}
