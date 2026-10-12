"use client";

import { IconCheck, IconChevronDown } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IMetric, ISignature } from "@/types/agreement";
import { breakOnUnderscore } from "@/lib/utils/formatter";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function SignatureMetrics({
  signatures,
  selectedMetric,
  open,
  onOpenChange,
}: {
  signatures: ISignature[];
  selectedMetric: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedSignatureId, setSelectedSignatureId] = useState<string>(
    signatures[0].signatureId,
  );
  const selectedSignature = signatures.find(
    (signature) => signature.signatureId === selectedSignatureId,
  );
  const metrics = selectedSignature!.guarantee.metrics;
  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      className="flex flex-col gap-4"
    >
      <div
        className={cn(
          "flex gap-2",
          signatures.length > 1 && open
            ? "flex-col @lg/main:flex-row @lg/main:items-center"
            : "items-center",
        )}
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="group flex flex-1 cursor-pointer items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Metrics
            </span>
            <Badge variant="muted">{metrics.length}</Badge>
            <Separator className="shrink" />
            <IconChevronDown className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </button>
        </CollapsibleTrigger>
        {signatures.length > 1 && open && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="primarySoft" size="sm">
                <span># {selectedSignature?.visualizationConfig.label}</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto">
              {signatures.map((signature) => {
                const isCurrent = signature.signatureId === selectedSignatureId;

                return (
                  <DropdownMenuItem
                    key={signature.signatureId}
                    disabled={isCurrent}
                    onClick={() =>
                      setSelectedSignatureId(signature.signatureId)
                    }
                  >
                    # {signature.visualizationConfig.label}
                    <span>{isCurrent && <IconCheck />}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <CollapsibleContent className="grid grid-cols-1 items-start gap-4 px-1 @4xl/main:grid-cols-2">
        {metrics.map((metric, index) => (
          <MetricCard
            metric={metric}
            index={index + 1}
            key={metric.metricName}
            selected={selectedMetric === metric.metricName}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function MetricCard({
  metric,
  index,
  selected,
}: {
  metric: IMetric;
  selected: boolean;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selected) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selected]);
  const hasFilters =
    Object.entries(metric.metricConfig.event.processConfig).length > 0;
  const hasConfiguration =
    metric.metricConfig.event.fetcherConfigs
      .map((fetcher) => Object.entries(fetcher.fetcherConfig))
      .flat().length > 0;
  const { aggregatorConfig } = metric.metricConfig.aggregation;
  const hasAggregationConfiguration = Object.keys(aggregatorConfig).length > 0;
  const fetcherIds = metric.metricConfig.event.fetcherConfigs
    .map((fetcher) => fetcher.fetcherId)
    .join(", ");
  return (
    <Card
      ref={ref}
      className={cn(
        "gap-3",
        selected &&
          "ring-1 ring-primary shadow-[0_0_8px_2px] shadow-primary/25",
      )}
    >
      <CardHeader className="flex items-center justify-between">
        {breakOnUnderscore(metric.metricName)}
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="@2xl/main:hidden">
            M{index}
          </Badge>
          <Badge variant="secondary">
            {metric.metricConfig.aggregation.aggregatorType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div
          className={cn(
            "flex",
            hasFilters ? "flex-col gap-3" : "items-center gap-2",
          )}
        >
          <span className="text-muted-foreground">Filters: </span>
          {hasFilters ? (
            <div className="flex flex-col rounded-md bg-muted/50 border-muted/50 border px-2 py-2 gap-1">
              <ConfigEntries config={metric.metricConfig.event.processConfig} />
            </div>
          ) : (
            <span>This metric has no filters</span>
          )}
        </div>
        <div
          className={cn(
            "flex",
            hasConfiguration ? "flex-col gap-3" : "items-center gap-2",
          )}
        >
          <span className="text-muted-foreground">Configuration: </span>
          {hasConfiguration ? (
            <div className="flex flex-col rounded-md bg-muted/50 border-muted/50 border px-2 py-2 gap-1">
              {metric.metricConfig.event.fetcherConfigs.map((fetcher) => {
                return (
                  <div key={fetcher.fetcherId} className="flex flex-col gap-1">
                    <ConfigEntries config={fetcher.fetcherConfig} />
                  </div>
                );
              })}
            </div>
          ) : (
            <span>This metric has no configuration</span>
          )}
        </div>
        <Collapsible className="flex flex-col gap-3">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="-ml-2 self-start">
              More details
              <IconChevronDown />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-muted-foreground">Fetchers: </span>
              <span>{breakOnUnderscore(fetcherIds)}</span>
            </div>
            <div
              className={cn(
                "flex",
                hasAggregationConfiguration
                  ? "flex-col gap-3"
                  : "items-center gap-2",
              )}
            >
              <span className="text-muted-foreground">
                Aggregation parameters:{" "}
              </span>
              {hasAggregationConfiguration ? (
                <div className="flex flex-col rounded-md bg-muted/50 border-muted/50 border px-2 py-2 gap-1">
                  <ConfigEntries config={aggregatorConfig} />
                </div>
              ) : (
                <span>This metric has no aggregation parameters</span>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

function ConfigEntries({ config }: { config: Record<string, unknown> }) {
  return Object.entries(config).map(([key, value]) => (
    <div key={key} className="flex items-baseline gap-2">
      <span className="text-muted-foreground">{key}: </span>
      <span className="wrap-anywhere">
        {typeof value === "string"
          ? value
          : Array.isArray(value)
            ? value.join(", ")
            : JSON.stringify(value)}
      </span>
    </div>
  ));
}
