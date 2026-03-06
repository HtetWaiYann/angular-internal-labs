import { Component, computed, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import type { TimelineEntry } from '../../services/router-lifecycle-state.service';

const TYPE_COLORS: Record<string, string> = {
  navigation: '#dc2626',
  guard:      '#ea580c',
  resolver:   '#9333ea',
  lazy:       '#16a34a',
};

interface GanttRow {
  label:   string;
  startMs: number;
  endMs:   number;
  type:    string;
  isPoint: boolean;
}

@Component({
  selector: 'app-nav-gantt',
  imports: [NgxEchartsDirective],
  templateUrl: './nav-gantt.component.html',
  styleUrl: './nav-gantt.component.css',
})
export class NavGanttComponent {
  readonly timeline = input.required<TimelineEntry[]>();

  /** Total ms for x-axis: NavigationEnd elapsed when complete, else last entry * 1.3 */
  private readonly totalMs = computed<number>(() => {
    const entries = this.timeline();
    if (!entries.length) return 100;
    const endEntry = entries.find(e =>
      e.label === 'NavigationEnd' || e.label === 'NavigationCancel' || e.label === 'NavigationError'
    );
    if (endEntry) return endEntry.elapsed || 100;
    const last = entries[entries.length - 1];
    return Math.ceil((last.elapsed || 10) * 1.4);
  });

  private readonly rows = computed<GanttRow[]>(() => {
    const entries = this.timeline();
    const rows: GanttRow[] = [];

    rows.push({ label: 'Start', startMs: 0, endMs: 0, type: 'navigation', isPoint: true });

    const recog = entries.find(e => e.label === 'RoutesRecognized');
    if (recog) rows.push({ label: 'Recognized', startMs: recog.elapsed, endMs: recog.elapsed, type: 'navigation', isPoint: true });

    const lS = entries.find(e => e.label === 'RouteConfigLoadStart');
    const lE = entries.find(e => e.label === 'RouteConfigLoadEnd');
    if (lS && lE) rows.push({ label: 'Lazy', startMs: lS.elapsed, endMs: lE.elapsed, type: 'lazy', isPoint: false });
    else if (lS)  rows.push({ label: 'Lazy…', startMs: lS.elapsed, endMs: lS.elapsed, type: 'lazy', isPoint: true });

    const gS = entries.find(e => e.label === 'GuardsCheckStart');
    const gE = entries.find(e => e.label === 'GuardsCheckEnd');
    if (gS && gE) rows.push({ label: 'Guards', startMs: gS.elapsed, endMs: gE.elapsed, type: 'guard', isPoint: false });
    else if (gS)  rows.push({ label: 'Guards…', startMs: gS.elapsed, endMs: gS.elapsed, type: 'guard', isPoint: true });

    const rS = entries.find(e => e.label === 'ResolveStart');
    const rE = entries.find(e => e.label === 'ResolveEnd');
    if (rS && rE) rows.push({ label: 'Resolve', startMs: rS.elapsed, endMs: rE.elapsed, type: 'resolver', isPoint: false });
    else if (rS)  rows.push({ label: 'Resolve…', startMs: rS.elapsed, endMs: rS.elapsed, type: 'resolver', isPoint: true });

    const endE = entries.find(e =>
      e.label === 'NavigationEnd' || e.label === 'NavigationCancel' || e.label === 'NavigationError'
    );
    if (endE) rows.push({
      label: endE.label === 'NavigationCancel' ? 'Cancelled' : endE.label === 'NavigationError' ? 'Error' : 'End',
      startMs: endE.elapsed, endMs: endE.elapsed, type: 'navigation', isPoint: true,
    });

    return rows;
  });

  readonly chartHeight = computed(() => this.rows().length * 28 + 40);

  readonly chartOption = computed<EChartsOption>(() => {
    const rows  = this.rows();
    const total = this.totalMs();
    if (!rows.length) return {};

    // ECharts y-axis is bottom-to-top, so reverse for top-to-bottom visual order
    const labels    = [...rows].reverse().map(r => r.label);
    const spacerData = [...rows].reverse().map(r => r.startMs);
    const barData    = [...rows].reverse().map((r, i) => {
      const w = r.isPoint
        ? Math.max(total * 0.02, 1)
        : Math.max(r.endMs - r.startMs, 2);
      return {
        value: w,
        itemStyle: {
          color: TYPE_COLORS[r.type] ?? '#94a3b8',
          borderRadius: r.isPoint ? 1 : 3,
          opacity: r.isPoint ? 0.7 : 0.85,
        },
        _rowIdx: rows.length - 1 - i,
      };
    });

    return {
      backgroundColor: 'transparent',
      animation: false,
      grid: { left: 80, right: 56, top: 8, bottom: 28 },
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: (params: any) => {
          if (params.seriesIndex === 0) return '';
          const row = rows[params.data._rowIdx as number];
          if (!row) return '';
          return row.isPoint
            ? `<b>${row.label}</b><br/>at ${row.startMs.toFixed(1)} ms`
            : `<b>${row.label}</b><br/>${row.startMs.toFixed(1)} → ${row.endMs.toFixed(1)} ms<br/><b>${(row.endMs - row.startMs).toFixed(0)} ms</b>`;
        },
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: total,
        axisLabel: {
          fontSize: 9,
          fontFamily: 'monospace',
          color: '#6b7280',
          formatter: (v: number) => `${v.toFixed(0)}ms`,
        },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)', type: 'dashed' } },
        axisLine: { lineStyle: { color: '#374151' } },
        axisTick: { lineStyle: { color: '#374151' } },
      },
      yAxis: {
        type: 'category',
        data: labels,
        axisLabel: { fontSize: 10, fontFamily: 'monospace', color: '#9ca3af' },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      series: [
        {
          type: 'bar',
          stack: 'gantt',
          silent: true,
          itemStyle: { color: 'transparent' },
          emphasis: { disabled: true },
          data: spacerData,
        },
        {
          type: 'bar',
          stack: 'gantt',
          barMaxWidth: 24,
          label: {
            show: true,
            position: 'right',
            fontSize: 9,
            fontFamily: 'monospace',
            color: '#9ca3af',
            formatter: (params: any) => {
              const row = rows[params.data._rowIdx as number];
              if (!row || row.isPoint) return '';
              return `${(row.endMs - row.startMs).toFixed(0)}ms`;
            },
          },
          data: barData,
        },
      ],
    };
  });
}
