"use client";

import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactECharts from "echarts-for-react";
import { format, roundToNearestMinutes } from "date-fns";
import { ChevronRight, ExternalLink, X } from "lucide-react";
import type {
  DefaultLabelFormatterCallbackParams,
  ECElementEvent,
  EChartsType,
} from "echarts";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { geistSans } from "@/lib/fonts";
import { cn } from "@/lib/utils/cn";
import type { Result } from "@/lib/utils/fetcher";
import {
  breakOnUnderscore,
  EXPAND_DATE_TIME_FORMAT,
  formatComplianceStatus,
  tokenizeExpression,
} from "@/lib/utils/formatter";
import type {
  IComplianceChartFocusedPoint,
  IComplianceChartMember,
  IComplianceChartPoint,
  IComplianceState,
} from "@/types/compliance";
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
            data: [{ value, name: label }],
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

export function TimelineChart({
  series,
  range,
  validity,
  threshold,
  getState,
  onZoom,
}: {
  series: { name: string; data: IComplianceChartPoint[] }[];
  range: { from: Date; to: Date };
  validity: { initial: Date; end: Date };
  threshold: { value: number; comparator: string };
  getState: (stateId: string) => Promise<Result<IComplianceState>>;
  onZoom: (range: { from: Date; to: Date }) => void;
}) {
  const [point, setPoint] = useState<IComplianceChartFocusedPoint | null>(null);
  const [inspected, setInspected] = useState<IComplianceChartMember | null>(
    null,
  );
  const legendSelected = useRef<Record<string, boolean>>({});
  const inspectedTime = inspected && point ? point.time : null;
  const inspectedColor = inspected?.color;

  const onEvents = useMemo(() => {
    const toPoint = (
      params: ECElementEvent,
      chart: EChartsType,
      pinned: boolean,
    ) => {
      if (params.componentType !== "series") return null;
      const { time, value, consolidated, complianceStatus } =
        series[params.seriesIndex ?? 0].data[params.dataIndex];
      const [x, y] = chart.convertToPixel({ seriesIndex: params.seriesIndex }, [
        time,
        value,
      ]);
      return {
        x,
        y,
        time,
        value,
        consolidated,
        complianceStatus,
        pinned,
        members: series.flatMap(({ name, data }, seriesIndex) => {
          const match =
            legendSelected.current[name] !== false &&
            data.find((item) => item.time === time && item.value === value);
          return match
            ? [
                {
                  label: name,
                  color: chart.getVisual({ seriesIndex }, "color") as string,
                  stateId: match.stateId,
                },
              ]
            : [];
        }),
      };
    };
    return {
      mouseover: (params: ECElementEvent, chart: EChartsType) => {
        const hovered = toPoint(params, chart, false);
        setPoint((current) => (current?.pinned ? current : hovered));
      },
      mouseout: () => setPoint((current) => (current?.pinned ? current : null)),
      click: (params: ECElementEvent, chart: EChartsType) => {
        setInspected(null);
        setPoint(toPoint(params, chart, true));
      },
      legendselectchanged: ({
        selected,
      }: {
        selected: Record<string, boolean>;
      }) => {
        legendSelected.current = selected;
      },
      brushEnd: (
        { areas }: { areas: { coordRange: [number, number] }[] },
        chart: EChartsType,
      ) => {
        chart.dispatchAction({ type: "brush", areas: [] });
        const zoomed = areas[0]?.coordRange;
        if (!zoomed) return;
        const [from, to] = zoomed.map((time) => roundToNearestMinutes(time));
        if (from.getTime() === to.getTime()) return; // from = to prohibited
        setInspected(null);
        setPoint(null);
        onZoom({ from, to });
      },
    };
  }, [series, onZoom]);

  const option = useMemo(
    () => ({
      legend: legendBase,
      tooltip: tooltipBase,
      grid: gridBase,
      brush: { xAxisIndex: 0, brushType: "lineX" },
      toolbox: { show: false },
      xAxis: {
        type: "time",
        min: range.from,
        max: range.to,
        splitNumber: 10,
        splitLine: { show: true },
        axisTick: { show: false },
        axisLabel: {
          hideOverlap: true,
          formatter: {
            day: "{MM}/{dd}",
            hour: "{HH}:{mm}",
            minute: "{HH}:{mm}",
          },
        },
      },
      yAxis: {
        type: "value",
        dataMin: threshold.value,
        dataMax: threshold.value,
        boundaryGap: [0, "10%"],
      },
      series: [
        ...series.map(({ name, data }) => ({
          type: "line",
          name,
          tooltip: { show: false },
          data: data.map(({ time, value, consolidated }) => ({
            value: [time, value],
            symbolSize: consolidated ? 6 : 4,
          })),
        })),
        {
          type: "line",
          data: [],
          markLine: {
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
          markArea: {
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
        },
        {
          type: "line",
          data: [],
          markLine: {
            z: 1,
            silent: true,
            symbol: "none",
            label: { show: false },
            lineStyle: { type: "dashed", color: inspectedColor, width: 2 },
            data: inspectedTime ? [{ xAxis: inspectedTime }] : [],
          },
        },
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
                `<div class="[text-align-last:justify]">${format(value as Date, EXPAND_DATE_TIME_FORMAT)}</div><div class="my-1.5 border-t"></div><div class="text-center">${name}</div>`,
            },
            data: [
              { xAxis: validity.initial, name: "Agreement start" },
              { xAxis: validity.end, name: "Agreement end" },
            ],
          },
        },
      ],
    }),
    [series, range, validity, threshold, inspectedTime, inspectedColor],
  );

  const onClose = () => {
    setInspected(null);
    setPoint(null);
  };

  return (
    <div className="relative h-full">
      <ReactECharts
        theme={THEME.timeline}
        style={{ height: "100%", minHeight: 250 }}
        onEvents={onEvents}
        onChartReady={(chart) =>
          chart.dispatchAction({
            type: "takeGlobalCursor",
            key: "brush",
            brushOption: {},
          })
        }
        option={option}
      />
      {point &&
        (inspected ? (
          <EvidencesPopover
            point={point}
            member={inspected}
            getState={getState}
            onClose={onClose}
          />
        ) : (
          <PointPopover
            point={point}
            onClose={onClose}
            onInspect={setInspected}
          />
        ))}
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

function PointPopover({
  point,
  onClose,
  onInspect,
}: {
  point: IComplianceChartFocusedPoint;
  onClose: () => void;
  onInspect: (member: IComplianceChartMember) => void;
}) {
  const isMobile = useIsMobile();

  return (
    <Popover open onOpenChange={() => point.pinned && onClose()}>
      <PopoverAnchor
        className="absolute"
        style={{ left: point.x, top: point.y }}
      />
      <PopoverContent
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "center" : "start"}
        sideOffset={20}
        alignOffset={isMobile ? 0 : 20}
        collisionPadding={16}
        sticky="always"
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="w-60 gap-0 p-3"
      >
        <div className="flex items-center gap-1">
          <span className="flex-1 [text-align-last:justify]">
            {format(new Date(point.time), EXPAND_DATE_TIME_FORMAT)}
          </span>
          {point.pinned && (
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Close"
              className="-my-0.5"
              onClick={onClose}
            >
              <X />
            </Button>
          )}
        </div>
        <PointRow label="Value">{point.value}</PointRow>
        <PointRow label="Status">
          {formatComplianceStatus(point.complianceStatus)}
        </PointRow>
        <PointRow label="Type">
          {point.consolidated ? "Consolidated" : "Evolutive"}
        </PointRow>
        <Separator className="my-1.5" />
        {point.pinned
          ? point.members.map((member) => (
              <Button
                key={member.stateId}
                variant="ghost"
                size="sm"
                aria-label={`Show evidences for ${member.label}`}
                className="-mx-1.5 h-7 px-1.5 font-normal"
                onClick={() => onInspect(member)}
              >
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: member.color }}
                />
                <span
                  className="flex-1 truncate text-left"
                  title={member.label}
                >
                  {member.label}
                </span>
                <span
                  className={cn(
                    "text-muted-foreground",
                    !isMobile &&
                      "opacity-0 group-hover/button:opacity-100 group-focus-visible/button:opacity-100",
                  )}
                >
                  Evidences
                </span>
                <ChevronRight className="text-muted-foreground" />
              </Button>
            ))
          : point.members.map((member) => (
              <div
                key={member.stateId}
                className="flex h-7 min-w-0 items-center justify-center gap-1"
              >
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: member.color }}
                />
                <span className="truncate" title={member.label}>
                  {member.label}
                </span>
              </div>
            ))}
      </PopoverContent>
    </Popover>
  );
}

const TOP_LEGEND_OFFSET = -10;
const BOTTOM_LEGEND_OFFSET = 43;

function EvidencesPopover({
  point,
  member,
  getState,
  onClose,
}: {
  point: IComplianceChartFocusedPoint;
  member: IComplianceChartMember;
  getState: (stateId: string) => Promise<Result<IComplianceState>>;
  onClose: () => void;
}) {
  const [result, setResult] = useState<Result<IComplianceState> | null>(null);
  const [openMetric, setOpenMetric] = useState("");
  const [side, setSide] = useState<"top" | "bottom">("bottom");
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getState(member.stateId).then(setResult);
  }, [member.stateId, getState]);

  useLayoutEffect(() => {
    if (!anchorRef.current) return;
    const cardBottom =
      anchorRef.current.getBoundingClientRect().bottom + // chart bottom position relative to the current window
      window.scrollY - // sum y scrolled space to transform to the absolute position
      BOTTOM_LEGEND_OFFSET + // remove the legend space
      460; // approximate value of the loaded basic card with open metric
    setSide(
      cardBottom <= document.documentElement.scrollHeight ? "bottom" : "top",
    );
  }, []);

  return (
    <Popover open onOpenChange={onClose}>
      <PopoverAnchor
        ref={anchorRef}
        className="absolute inset-y-0"
        style={{ left: point.x }}
      />
      <PopoverContent
        side={side}
        align="center"
        sideOffset={side === "top" ? TOP_LEGEND_OFFSET : -BOTTOM_LEGEND_OFFSET}
        collisionPadding={{ left: 16, right: 16, top: -1000, bottom: -1000 }} // padding in top and bottom to avoid flip while scrolling
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="flex w-[min(32rem,calc(100vw-2rem))] flex-col gap-0 p-0"
      >
        <PopoverHeader className="border-b px-3 py-2">
          <div className="flex items-center justify-between gap-3">
            <PopoverTitle>Evidences</PopoverTitle>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Close"
              onClick={onClose}
            >
              <X />
            </Button>
          </div>
          <div className="flex items-center justify-between gap-3">
            <PopoverDescription className="shrink-0">
              {format(new Date(point.time), EXPAND_DATE_TIME_FORMAT)}
            </PopoverDescription>
            {result?.ok && (
              <div className="flex min-w-0 flex-wrap items-center justify-end gap-1">
                <NumericExpression
                  state={result.data}
                  openMetric={openMetric}
                  onToggle={(name) =>
                    setOpenMetric((current) => (current === name ? "" : name))
                  }
                />
                <span>=</span>
                <span>{result.data.numericExpressionValue ?? "N/A"}</span>
              </div>
            )}
          </div>
        </PopoverHeader>
        <div className="px-3">
          {!result ? (
            <div className="flex justify-center py-4">
              <Spinner className="size-5 text-muted-foreground" />
            </div>
          ) : !result.ok ? (
            <span className="flex justify-center py-4 text-muted-foreground">
              Something went wrong while loading the evidences.
            </span>
          ) : (
            <Accordion
              type="single"
              collapsible
              value={openMetric}
              onValueChange={setOpenMetric}
            >
              {result.data.metrics.map((metric) => (
                <AccordionItem
                  key={metric.metricName}
                  value={metric.metricName}
                >
                  <AccordionTrigger className="items-center gap-2 py-2">
                    <span className="flex-1">
                      {breakOnUnderscore(metric.metricName)}
                    </span>
                    <Badge variant="secondary">
                      {metric.value ?? metric.status}
                    </Badge>
                  </AccordionTrigger>
                  <AccordionContent className="flex max-h-64 flex-col gap-3 overflow-y-auto pb-3">
                    {metric.status === "FAILED" && metric.errorMessage ? (
                      <span className="break-words text-destructive">
                        {metric.errorMessage}
                      </span>
                    ) : metric.evidences.length === 0 ? (
                      <span className="text-muted-foreground">
                        No evidences for this metric
                      </span>
                    ) : (
                      metric.evidences.map((evidence, index) => {
                        // TODO: may require changes to handle other type of evidences
                        const { url, content } = evidence as {
                          url?: string;
                          content?: { url?: string };
                        };
                        const href = url ?? content?.url;
                        return (
                          <div key={index} className="flex flex-col gap-1">
                            <div className="flex items-baseline gap-2">
                              <span>{index + 1}.</span>
                              {href && (
                                <Button
                                  asChild
                                  variant="link"
                                  size="xs"
                                  className="h-auto p-0"
                                >
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Open ${href}`}
                                  >
                                    Open URL
                                    <ExternalLink />
                                  </a>
                                </Button>
                              )}
                            </div>
                            <pre className="rounded-md bg-muted p-2 font-mono text-xs break-all whitespace-pre-wrap">
                              {JSON.stringify(evidence, null, 2)}
                            </pre>
                          </div>
                        );
                      })
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 border-t p-3">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: member.color }}
            />
            <span className="truncate" title={member.label}>
              {member.label}
            </span>
            <span className="shrink-0 text-muted-foreground">
              {point.consolidated ? "Consolidated" : "Evolutive"}
            </span>
          </div>
          {result?.ok && (
            <Badge
              variant={
                result.data.complianceStatus === "COMPLIANT"
                  ? "success"
                  : result.data.complianceStatus === "NON_COMPLIANT"
                    ? "destructive"
                    : "muted"
              }
            >
              {formatComplianceStatus(result.data.complianceStatus)}
            </Badge>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NumericExpression({
  state,
  openMetric,
  onToggle,
}: {
  state: IComplianceState;
  openMetric: string;
  onToggle: (metricName: string) => void;
}) {
  const tokens = tokenizeExpression(state.numericExpression);
  if (tokens === null) return <span>{state.numericExpression}</span>;
  return tokens.map((token, index) => {
    const metric = state.metrics.find(({ metricName }) => metricName === token);
    return metric ? (
      <Button
        key={index}
        size="xs"
        variant={openMetric === token ? "default" : "primarySoft"}
        onClick={() => onToggle(token)}
      >
        {metric.value ?? "N/A"}
      </Button>
    ) : (
      <span key={index}>{token}</span>
    );
  });
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
