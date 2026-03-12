import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  inject,
  OnDestroy,
} from '@angular/core';
import { TooltipService } from './tooltip.service';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly tooltip = inject(TooltipService);

  @Input() appTooltip = '';

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.appTooltip?.trim()) {
      this.tooltip.show(this.el.nativeElement, this.appTooltip);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.tooltip.hide();
  }

  @HostListener('focusin')
  onFocusIn(): void {
    if (this.appTooltip?.trim()) {
      this.tooltip.show(this.el.nativeElement, this.appTooltip);
    }
  }

  @HostListener('focusout')
  onFocusOut(): void {
    this.tooltip.hide();
  }

  ngOnDestroy(): void {
    if (this.tooltip.isShowingFor(this.el.nativeElement)) {
      this.tooltip.hideImmediate();
    }
  }
}
