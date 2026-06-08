import { Component, computed } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

interface TreeNode {
  name: string;
  value?: string;
  itemStyle?: { borderColor: string; color: string };
  children?: TreeNode[];
}

@Component({
  selector: 'app-injector-hierarchy-chart',
  imports: [NgxEchartsDirective],
  templateUrl: './injector-hierarchy-chart.component.html',
  styleUrl: './injector-hierarchy-chart.component.css',
})
export class InjectorHierarchyChartComponent {
  /** Inverted: Child at root (bottom), NullInjector at leaf (top). Lookup walks bottom → top. */
  private readonly treeData: TreeNode = {
    name: 'Child Component',
    value: 'child',
    itemStyle: { borderColor: '#1d4ed8', color: 'rgba(29, 78, 216, 0.12)' },
    children: [
      {
        name: 'ComponentInjector',
        value: 'component',
        itemStyle: { borderColor: '#15803d', color: 'rgba(21, 128, 61, 0.12)' },
        children: [
          {
            name: 'EnvironmentInjector',
            value: 'env',
            itemStyle: { borderColor: '#6d28d9', color: 'rgba(109, 40, 217, 0.12)' },
            children: [
              {
                name: 'RootInjector',
                value: 'root',
                itemStyle: { borderColor: '#004953', color: 'rgba(0, 73, 83, 0.12)' },
                children: [
                  {
                    name: 'PlatformInjector',
                    value: 'platform',
                    itemStyle: { borderColor: '#c2410c', color: 'rgba(194, 65, 12, 0.12)' },
                    children: [
                      {
                        name: 'NullInjector',
                        value: 'top',
                        itemStyle: { borderColor: '#6b7280', color: 'rgba(107, 114, 128, 0.12)' },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  readonly chartOption = computed<EChartsOption>(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      confine: true,
      formatter: (params: unknown) => {
        const p = Array.isArray(params) ? params[0] : params;
        const name = (p as { name?: string })?.name ?? 'Unknown';
        return `<b>${name}</b><br/>Lookup starts here and walks up to parent`;
      },
    },
    series: [
      {
        type: 'tree',
        data: [this.treeData],
        orient: 'BT',
        top: '5%',
        left: '8%',
        bottom: '5%',
        right: '8%',
        symbolSize: 20,
        nodeGap: 28,
        layerGap: 36,
        edgeShape: 'polyline',
        edgeForkPosition: '50%',
        initialTreeDepth: -1,
        lineStyle: {
          color: '#b9bcc2',
          width: 2,
        },
        label: {
          position: 'right',
          verticalAlign: 'middle',
          align: 'left',
          fontSize: 13,
          fontFamily: 'ui-monospace, monospace',
          color: '#1a1f24',
          formatter: '{b}',
          distance: 12,
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left',
            distance: 12,
          },
        },
        expandAndCollapse: false,
        animationDuration: 0,
        itemStyle: {
          borderWidth: 2,
        },
        emphasis: {
          focus: 'ancestor',
          itemStyle: {
            borderColor: '#004953',
            borderWidth: 2,
          },
        },
      },
    ],
  }));
}
