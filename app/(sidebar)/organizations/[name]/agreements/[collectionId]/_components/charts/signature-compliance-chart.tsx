"use client";

import ReactECharts from "echarts-for-react";
import type { DefaultLabelFormatterCallbackParams } from "echarts";

import { gridBase, legendBase, THEME, tooltipBase } from "@/lib/echarts";

export function SignatureComplianceChart({
  rows,
}: {
  rows: {
    label: string;
    allTime: number | null;
    selectedPeriod: number | null;
  }[];
}) {
  return (
    <ReactECharts
      theme={THEME.compliance}
      style={{ height: Math.max(150, rows.length * 70 + 60) }}
      option={{
        legend: legendBase,
        grid: gridBase,
        tooltip: {
          ...tooltipBase,
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: (params: DefaultLabelFormatterCallbackParams[]) => {
            const { label, allTime, selectedPeriod } =
              rows[params[0].dataIndex];
            return `<div class="text-center">${label}</div><div class="my-1.5 border-t"></div>${params
              .map(({ marker, seriesName, seriesIndex }) => {
                const value = [allTime, selectedPeriod][seriesIndex ?? 0];
                return `<div class="flex justify-between gap-6"><span>${marker}${seriesName}</span><span class="font-medium">${value === null ? "N/A" : `${value.toFixed(1)}%`}</span></div>`;
              })
              .join("")}`;
          },
        },
        xAxis: {
          type: "value",
          min: 0,
          max: 100,
          interval: 10,
          axisLabel: { hideOverlap: true, formatter: "{value}%" },
        },
        yAxis: { type: "category", data: rows.map(({ label }) => label) },
        series: [
          {
            type: "bar",
            name: "All time",
            barMinHeight: 3,
            data: rows.map(({ allTime }) => allTime),
          },
          {
            type: "bar",
            name: "Selected period",
            barMinHeight: 3,
            data: rows.map(({ selectedPeriod }) => selectedPeriod),
          },
        ],
      }}
    />
  );
}
