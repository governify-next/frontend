"use client";

import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { BarChart, GaugeChart, LineChart } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { ECElementEvent, EChartsCoreOption } from "echarts/core";

echarts.use([
  BarChart,
  GaugeChart,
  LineChart,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TooltipComponent,
  CanvasRenderer,
]);

export const chartColors = {
  foreground: "#090b0c",
  mutedForeground: "#67787c",
  border: "#e3e7e8",
  muted: "#f1f3f3",
  primary: "#007595",
  destructive: "#e7000b",
  success: "#00a63e",
  warning: "#fe9a00",
};

const axis = {
  axisLine: { lineStyle: { color: chartColors.border } },
  axisTick: { lineStyle: { color: chartColors.border } },
  axisLabel: { color: chartColors.mutedForeground },
  splitLine: { lineStyle: { color: chartColors.border, type: "dashed" } },
};

const shadcnTheme = {
  color: [
    chartColors.primary,
    "#8e51ff", // violet-500
    "#f6339a", // pink-500
    "#2b7fff", // blue-500
    "#fe9a00", // amber-500
    "#62748e", // slate-500
  ],
  textStyle: {
    fontFamily: "Geist, 'Geist Fallback', sans-serif",
    color: chartColors.foreground,
  },
  legend: { textStyle: { color: chartColors.mutedForeground } },
  tooltip: {
    backgroundColor: "#ffffff",
    borderColor: chartColors.border,
    textStyle: { color: chartColors.foreground, fontSize: 12 },
    extraCssText:
      "border-radius: 0.625rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);",
  },
  timeAxis: axis,
  valueAxis: axis,
  categoryAxis: axis,
};

export function EChart({
  option,
  onClick,
  height = 300,
}: {
  option: EChartsCoreOption;
  onClick?: (params: ECElementEvent) => void;
  height?: number;
}) {
  return (
    <ReactEChartsCore
      echarts={echarts}
      theme={shadcnTheme}
      option={option}
      onEvents={onClick && { click: onClick }}
      notMerge
      style={{ height }}
    />
  );
}
