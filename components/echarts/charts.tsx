"use client";

import ReactECharts from "echarts-for-react";
import { format } from "date-fns";
import type { DefaultLabelFormatterCallbackParams } from "echarts";

import { geistSans } from "@/lib/fonts";
import { DATE_TIME_FORMAT } from "@/lib/utils/formatter";
import {
  complianceColor,
  gaugeBase,
  gaugeGradient,
  gridBase,
  legendBase,
  PALETTE,
  THEME,
  tooltipBase,
} from "./config";

export function ComplianceGauge({
  value,
  label,
}: {
  value: number | null;
  label: string;
}) {
  return (
    <ReactECharts
      theme={THEME}
      style={{ height: 200 }}
      option={{
        series: [
          {
            ...gaugeBase,
            radius: "75%",
            axisLine: {
              lineStyle: { width: 20, color: [[1, PALETTE.gray]] },
            },
            progress: {
              show: true,
              width: 20,
              itemStyle: { color: gaugeGradient((value ?? 0) / 100) },
            },
            detail: {
              offsetCenter: [0, 0],
              fontSize: 25,
              fontFamily: geistSans.style.fontFamily,
              formatter: () =>
                value === null ? "N/A" : `${value.toFixed(1)}%`,
            },
            title: {
              offsetCenter: [0, "40%"],
              fontSize: 12,
              fontFamily: geistSans.style.fontFamily,
            },
            data: [{ value, name: label }],
          },
          {
            ...gaugeBase,
            radius: "82%",
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

const chartTooltip = (
  title: string,
  rows: string[],
  titleClass = "[text-align-last:justify]",
) =>
  [`<div class="${titleClass}">${title}</div>`, ...rows].join(
    '<div class="my-1.5 border-t"></div>',
  );

const tooltipRow = (label: string, value: string | number) =>
  `<div class="flex justify-between gap-6"><span>${label}</span><span class="font-medium">${value}</span></div>`;

export function TimelineChart({
  series,
  range,
  validity,
  threshold,
}: {
  series: {
    name: string;
    data: { time: string; value: number; consolidated: boolean }[];
  }[];
  range: { from: Date; to: Date };
  validity: { initial: Date; end: Date };
  threshold: { value: number; comparator: string };
}) {
  const validityLines = [
    { date: validity.initial, label: "Agreement start" },
    { date: validity.end, label: "Agreement end" },
  ].filter(({ date }) => date >= range.from && date <= range.to);

  return (
    <ReactECharts
      theme={THEME}
      style={{ height: "100%", minHeight: 300 }}
      option={{
        legend: legendBase,
        tooltip: {
          ...tooltipBase,
          formatter: (params: DefaultLabelFormatterCallbackParams) => {
            const { name, data } = series[params.seriesIndex ?? 0];
            const point = data[params.dataIndex];
            return chartTooltip(
              format(new Date(point.time), DATE_TIME_FORMAT),
              [
                tooltipRow("Value", point.value),
                tooltipRow(
                  "Type",
                  point.consolidated ? "Consolidated" : "Evolutive",
                ),
                `<div class="flex items-center justify-center">${params.marker}${name}</div>`,
              ],
            );
          },
        },
        grid: gridBase,
        xAxis: {
          type: "time",
          min: range.from,
          max: range.to,
          splitNumber: 10,
          splitLine: { show: true },
          axisLabel: {
            formatter: {
              day: "{MM}/{dd}",
              hour: "{HH}:{mm}",
              minute: "{HH}:{mm}",
            },
          },
        },
        yAxis: { type: "value" },
        series: [
          ...series.map(({ name, data }, index) => ({
            type: "line",
            name,
            data: data.map(({ time, value, consolidated }) => ({
              value: [time, value],
              symbolSize: consolidated ? 6 : 4,
            })),
            markLine: index === 0 && {
              z: 2,
              silent: true,
              symbol: "none",
              label: { show: false },
              lineStyle: {
                type: "solid",
                color: complianceColor(
                  [">=", "<=", "=="].includes(threshold.comparator),
                ),
              },
              data: [{ yAxis: threshold.value }],
            },
            markArea: index === 0 && {
              silent: true,
              data: [
                [
                  {
                    yAxis: threshold.value,
                    itemStyle: {
                      color: complianceColor(
                        [">", ">=", "!="].includes(threshold.comparator),
                      ),
                      opacity: 0.1,
                    },
                  },
                  {},
                ],
                [
                  {
                    itemStyle: {
                      color: complianceColor(
                        ["<", "<=", "!="].includes(threshold.comparator),
                      ),
                      opacity: 0.1,
                    },
                  },
                  { yAxis: threshold.value },
                ],
              ],
            },
          })),
          {
            type: "line",
            data: [],
            markLine: {
              symbol: "none",
              label: { show: false },
              lineStyle: { type: "dashed", color: PALETTE.black, width: 2 },
              tooltip: {
                formatter: (params: DefaultLabelFormatterCallbackParams) =>
                  chartTooltip(
                    format(
                      validityLines[params.dataIndex].date,
                      DATE_TIME_FORMAT,
                    ),
                    [
                      `<div class="text-center">${validityLines[params.dataIndex].label}</div>`,
                    ],
                  ),
              },
              data: validityLines.map(({ date }) => ({ xAxis: date })),
            },
          },
        ],
      }}
    />
  );
}

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
      theme={THEME}
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
            return chartTooltip(
              label,
              [
                params
                  .map(({ marker, seriesName, seriesIndex }) => {
                    const value = [allTime, selectedPeriod][seriesIndex ?? 0];
                    return tooltipRow(
                      `${marker}${seriesName}`,
                      value === null ? "N/A" : `${value.toFixed(1)}%`,
                    );
                  })
                  .join(""),
              ],
              "text-center",
            );
          },
        },
        xAxis: {
          type: "value",
          min: 0,
          max: 100,
          interval: 5,
          axisLabel: { formatter: (value: number) => `${value.toFixed(1)}%` },
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
