"use client";

import { toast } from "sonner";
import type { EChartsCoreOption } from "echarts/core";

import { chartColors, EChart } from "@/components/chart/echart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ISignature } from "@/types/agreement";
import { IDashboardPoint, IGuaranteeDashboardData } from "@/types/dashboard";

// PoC: Grafana panels rebuilt with ECharts.

const STATUS_COLORS: Record<string, string> = {
  COMPLIANT: chartColors.success,
  NON_COMPLIANT: chartColors.destructive,
};

// Same steps as the Grafana gauges: red < 50, yellow < 80, green >= 80.
const complianceColor = (value: number) =>
  value < 50
    ? chartColors.destructive
    : value < 80
      ? chartColors.warning
      : chartColors.success;

const formatPercentage = (value: number | null) =>
  value === null ? "N/A" : `${value.toFixed(1)}%`;

export function GuaranteeCharts({
  signatures,
  data,
  range,
}: {
  signatures: ISignature[];
  data: IGuaranteeDashboardData | undefined;
  range: { from: Date; to: Date };
}) {
  return (
    <div>
      <div className="flex items-center gap-2 pb-4">
        <span className="text-xs font-medium uppercase text-muted-foreground">
          Compliance
        </span>
        <Separator className="shrink" />
      </div>
      {!data ? (
        <span className="text-muted-foreground">
          There is no data for this guarantee yet.
        </span>
      ) : (
        <div className="flex flex-col gap-4 px-1">
          <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2">
            <ChartCard title="All time compliance">
              <EChart option={gaugeOption(data.allTime)} height={180} />
            </ChartCard>
            <ChartCard title="Selected period compliance">
              <EChart option={gaugeOption(data.selectedPeriod)} height={180} />
            </ChartCard>
          </div>
          <ChartCard title="Timeline">
            <EChart
              option={timelineOption(signatures, data.points, range)}
              onClick={(params) => {
                const { point } = params.data as { point: IDashboardPoint };
                toast.info(`State ${point.stateId}`);
              }}
            />
          </ChartCard>
          {signatures.length > 1 && (
            <ChartCard title="Signature compliance">
              <EChart
                option={signatureBarsOption(signatures, data)}
                height={80 + signatures.length * 40}
              />
            </ChartCard>
          )}
        </div>
      )}
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

const gaugeOption = (value: number | null): EChartsCoreOption => ({
  series: [
    {
      type: "gauge",
      min: 0,
      max: 100,
      radius: "95%",
      center: ["50%", "60%"],
      startAngle: 200,
      endAngle: -20,
      axisLine: {
        roundCap: true,
        lineStyle: { width: 14, color: [[1, chartColors.muted]] },
      },
      progress: {
        show: value !== null,
        roundCap: true,
        width: 14,
        itemStyle: { color: complianceColor(value ?? 0) },
      },
      pointer: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        offsetCenter: [0, 0],
        fontSize: 28,
        fontWeight: 600,
        color: chartColors.foreground,
        formatter: () => formatPercentage(value),
      },
      data: [{ value: value ?? 0 }],
    },
  ],
});

const timelineOption = (
  signatures: ISignature[],
  points: IDashboardPoint[],
  range: { from: Date; to: Date },
): EChartsCoreOption => ({
  tooltip: {
    trigger: "item",
    formatter: (params: {
      seriesName: string;
      data: { point: IDashboardPoint };
    }) => {
      const { point } = params.data;
      return [
        `<b>${params.seriesName}</b>`,
        new Date(point.time).toLocaleString(),
        `Value: <b>${point.value}</b>`,
        `${point.complianceStatus} · ${point.consolidated ? "Consolidated" : "Evolutive"}`,
      ].join("<br/>");
    },
  },
  legend: { top: 0 },
  grid: { top: 40, bottom: 70 },
  xAxis: { type: "time", min: range.from, max: range.to },
  yAxis: { type: "value" },
  dataZoom: [{ type: "inside" }, { type: "slider" }],
  series: signatures.map((signature, index) => ({
    type: "line",
    name: signature.visualizationConfig.label,
    symbol: "circle",
    symbolSize: 7,
    showAllSymbol: true,
    data: points
      .filter((point) => point.signatureId === signature.signatureId)
      .map((point) => ({
        value: [point.time, point.value],
        itemStyle: {
          color:
            STATUS_COLORS[point.complianceStatus] ??
            chartColors.mutedForeground,
        },
        point,
      })),
    // The threshold is the same for every signature of the guarantee.
    markLine: index === 0 && {
      silent: true,
      symbol: "none",
      lineStyle: { color: chartColors.mutedForeground, type: "dashed" },
      label: { formatter: "Threshold {c}", position: "insideEndTop" },
      data: [{ yAxis: signature.guarantee.threshold }],
    },
  })),
});

const signatureBarsOption = (
  signatures: ISignature[],
  data: IGuaranteeDashboardData,
): EChartsCoreOption => {
  const rows = signatures.map((signature) =>
    data.bySignature.find((row) => row.signatureId === signature.signatureId),
  );
  return {
    tooltip: { trigger: "axis", valueFormatter: formatPercentage },
    legend: {},
    grid: { top: 8, bottom: 40 },
    xAxis: {
      type: "value",
      min: 0,
      max: 100,
      axisLabel: { formatter: "{value}%" },
    },
    yAxis: {
      type: "category",
      inverse: true,
      data: signatures.map((signature) => signature.visualizationConfig.label),
    },
    series: [
      {
        type: "bar",
        name: "All time",
        itemStyle: { borderRadius: [0, 4, 4, 0] },
        data: rows.map((row) => row?.allTime ?? null),
      },
      {
        type: "bar",
        name: "Selected period",
        itemStyle: { borderRadius: [0, 4, 4, 0] },
        data: rows.map((row) => row?.selectedPeriod ?? null),
      },
    ],
  };
};
