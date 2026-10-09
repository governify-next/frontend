"use client";

import { type ReactNode, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { format } from "date-fns";
import { X } from "lucide-react";
import type {
  DefaultLabelFormatterCallbackParams,
  ECElementEvent,
  EChartsType,
} from "echarts";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { geistSans } from "@/lib/fonts";
import { DATE_TIME_FORMAT } from "@/lib/utils/formatter";
import type { IComplianceTimelinePoint } from "@/types/compliance";
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
  const [point, setPoint] = useState<IComplianceTimelinePoint | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const onEvents = useMemo(() => {
    const toPoint = (
      params: ECElementEvent,
      chart: EChartsType,
      pinned: boolean,
    ) => {
      if (params.componentType !== "series") return null;
      const { name: label, data } = series[params.seriesIndex ?? 0];
      const item = data[params.dataIndex];
      const [x, y] = chart.convertToPixel({ seriesIndex: params.seriesIndex }, [
        item.time,
        item.value,
      ]);
      return {
        x,
        y,
        label,
        color: params.color as string,
        ...item,
        pinned,
      };
    };
    return {
      mouseover: (params: ECElementEvent, chart: EChartsType) => {
        const hovered = toPoint(params, chart, false);
        setPoint((current) => (current?.pinned ? current : hovered));
      },
      mouseout: () => setPoint((current) => (current?.pinned ? current : null)),
      click: (params: ECElementEvent, chart: EChartsType) => {
        const clicked = toPoint(params, chart, true);
        if (clicked) setPoint(clicked);
      },
    };
  }, [series]);

  const option = useMemo(
    () => ({
      legend: legendBase,
      tooltip: tooltipBase,
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
          tooltip: { show: false },
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
              formatter: ({
                name,
                value,
              }: DefaultLabelFormatterCallbackParams) =>
                `<div class="[text-align-last:justify]">${format(value as Date, DATE_TIME_FORMAT)}</div><div class="my-1.5 border-t"></div><div class="text-center">${name}</div>`,
            },
            data: [
              { xAxis: validity.initial, name: "Agreement start" },
              { xAxis: validity.end, name: "Agreement end" },
            ],
          },
        },
      ],
    }),
    [series, range, validity, threshold],
  );

  return (
    <div ref={setContainer} className="relative h-full">
      <ReactECharts
        theme={THEME}
        style={{ height: "100%", minHeight: 300 }}
        onEvents={onEvents}
        option={option}
      />
      {point && (
        <PointPopover
          point={point}
          container={container}
          onClose={() => setPoint(null)}
        />
      )}
    </div>
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

function PointPopover({
  point,
  container,
  onClose,
}: {
  point: IComplianceTimelinePoint;
  container: HTMLDivElement | null;
  onClose: () => void;
}) {
  return (
    <Popover open onOpenChange={() => point.pinned && onClose()}>
      <PopoverAnchor
        className="absolute"
        style={{ left: point.x, top: point.y }}
      />
      <PopoverContent
        side="right"
        align="start"
        sideOffset={20}
        alignOffset={20}
        sticky="always"
        collisionBoundary={container}
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="w-60 gap-0 p-3"
      >
        <div className="[text-align-last:justify]">
          {format(new Date(point.time), DATE_TIME_FORMAT)}
        </div>
        <PointRow label="Value">{point.value}</PointRow>
        <PointRow label="Type">
          {point.consolidated ? "Consolidated" : "Evolutive"}
        </PointRow>
        <PointRow label="Signature">
          <span
            className="mr-1 size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: point.color }}
          />
          <span className="truncate" title={point.label}>
            {point.label}
          </span>
        </PointRow>
        {point.pinned && (
          <>
            <Separator className="my-1.5" />
            <div className="flex gap-1">
              <Button
                variant="destructive"
                size="icon-sm"
                aria-label="Close"
                onClick={onClose}
              >
                <X />
              </Button>
              <Button variant="primarySoft" size="sm" className="flex-1">
                Show evidences
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

function PointRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <Separator className="my-1.5" />
      <div className="flex justify-between gap-6">
        <span>{label}</span>
        <span className="flex min-w-0 items-center">{children}</span>
      </div>
    </>
  );
}
