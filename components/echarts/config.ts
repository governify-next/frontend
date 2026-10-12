import { color } from "echarts";
import "echarts/theme/tech-blue.js";

export const THEME = "tech-blue";

export const PALETTE = {
  red: "#d53d3a",
  amber: "#fea91e",
  green: "#2e9463",
  black: "#000000",
  gray: "#e8ebf0",
};

const GAUGE_COLORS = [PALETTE.red, PALETTE.amber, PALETTE.green];

export const complianceColor = (compliant: boolean) =>
  compliant ? PALETTE.green : PALETTE.red;

export const gaugeBase = {
  type: "gauge",
  startAngle: 200,
  endAngle: -20,
  center: ["50%", "61%"],
  pointer: { show: false },
  axisTick: { show: false },
  splitLine: { show: false },
  axisLabel: { show: false },
} as const;

export const gaugeGradient = (progress: number) => ({
  type: "linear",
  x: 0,
  y: 0,
  x2: 1,
  y2: 0,
  colorStops: [
    ...GAUGE_COLORS.map((stop, index) => ({
      offset: index / (GAUGE_COLORS.length - 1) / progress,
      color: stop,
    })).filter((stop) => stop.offset < 1),
    { offset: 1, color: color.lerp(progress, GAUGE_COLORS) },
  ],
});

export const tooltipBase = {
  className:
    "hidden rounded-md! border-0! bg-popover! p-3! font-sans! text-sm! text-popover-foreground! shadow-md! ring-1! ring-foreground/10",
};

export const legendBase = {
  bottom: 0,
  textStyle: { padding: [3, 0, 0, 0] },
};

export const gridBase = {
  left: 0,
  right: 8,
  top: 10,
  bottom: 30,
  outerBoundsMode: "same",
} as const;
