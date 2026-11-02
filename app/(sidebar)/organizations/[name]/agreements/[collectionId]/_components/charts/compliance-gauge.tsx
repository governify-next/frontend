"use client";

import ReactECharts from "echarts-for-react";

import { gaugeBase, gaugeGradient, PALETTE } from "@/lib/echarts";
import { geistSans } from "@/lib/fonts";

export function ComplianceGauge({
  value,
  label,
}: {
  value: number | null;
  label: string;
}) {
  return (
    <ReactECharts
      style={{ height: 150 }}
      option={{
        series: [
          {
            ...gaugeBase,
            radius: "92%",
            axisLine: {
              lineStyle: { width: 15, color: [[1, PALETTE.gray]] },
            },
            progress: {
              show: true,
              width: 15,
              itemStyle: { color: gaugeGradient((value ?? 0) / 100) },
            },
            detail: {
              offsetCenter: [0, 0],
              fontSize: 22,
              fontFamily: geistSans.style.fontFamily,
              formatter: () =>
                value === null ? "N/A" : `${value.toFixed(1)}%`,
            },
            title: {
              offsetCenter: [0, "40%"],
              fontSize: 12,
              fontFamily: geistSans.style.fontFamily,
            },
            data: [{ value: value ?? 0, name: label }],
          },
          {
            ...gaugeBase,
            radius: "99%",
            axisLine: { show: false },
            progress: {
              show: true,
              width: 4,
              itemStyle: { color: gaugeGradient(1) },
            },
            detail: { show: false },
            data: [{ value: 100 }],
          },
        ],
      }}
    />
  );
}
