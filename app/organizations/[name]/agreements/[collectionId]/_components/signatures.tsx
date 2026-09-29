"use client";

import { Clock2, Pin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IGuarantee, ISignature, IWindow } from "@/types/agreement";
import { breakOnUnderscore, formatReadableDate } from "@/lib/utils/formatter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { SignatureMetrics } from "./signature-metrics";

// Parser synced with guaranteeTemplate.validator in registry
const TOKEN_REGEX = /[A-Za-z_][A-Za-z0-9_-]*|\d+(?:\.\d+)?|[+\-*/()]/g;
const REPLACEMENTS: Record<string, string> = { "*": "×", "-": "−" };

const tokenizeExpression = (expression: string) => {
  const tokens = expression.match(TOKEN_REGEX);

  // If something missing, return null
  if (!tokens || tokens.join("") !== expression) return null;

  return tokens.map((token) => REPLACEMENTS[token] ?? token);
};

const formatComparator = (comparator: string) => {
  switch (comparator) {
    case ">=":
      return "≥";
    case "<=":
      return "≤";
    case "==":
      return "=";
    case "!=":
      return "≠";
    // For >, <
    default:
      return comparator;
  }
};

const formatPeriod = (window: IWindow) =>
  window.period.map((period) => `${period.value} ${period.unit}`).join(", ");

export function AgreementVersionSignatures({
  groupedSignatures,
  timezone,
}: {
  groupedSignatures: Map<string, ISignature[]>;
  timezone: string;
}) {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  return (
    <Accordion type="single" collapsible>
      {Array.from(groupedSignatures).map(([guaranteeName, signatures]) => {
        const firstSignature = signatures[0];
        const comparator = formatComparator(
          firstSignature.guarantee.comparator,
        );
        return (
          <AccordionItem key={guaranteeName} value={guaranteeName}>
            <AccordionTrigger className="flex items-center py-5">
              <span className="flex-1">{breakOnUnderscore(guaranteeName)}</span>
              <div className="flex items-center gap-2 pr-2 hidden @lg/main:flex">
                <Badge variant="secondary">
                  {formatComparator(firstSignature.guarantee.comparator)}{" "}
                  {firstSignature.guarantee.threshold}
                </Badge>
                <Badge variant="secondary">
                  {formatPeriod(firstSignature.guarantee.window)}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-5 px-1">
              <SignatureObjective
                guarantee={firstSignature.guarantee}
                comparator={comparator}
                onMetricSelected={setSelectedMetric}
                selectedMetric={selectedMetric}
                timezone={timezone}
              />
              <SignatureMetrics
                signatures={signatures}
                selectedMetric={selectedMetric}
              />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

function SignatureObjective({
  guarantee,
  comparator,
  onMetricSelected,
  selectedMetric,
  timezone,
}: {
  guarantee: IGuarantee;
  comparator: string;
  onMetricSelected: (metric: string | null) => void;
  selectedMetric: string | null;
  timezone: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 pb-2">
        <span className="text-xs font-medium uppercase text-muted-foreground">
          Objective
        </span>
        <Separator className="shrink" />
      </div>
      <div className="flex flex-col gap-3">
        <SignatureExpression
          guarantee={guarantee}
          comparator={comparator}
          onMetricSelected={onMetricSelected}
          selectedMetric={selectedMetric}
        />
        <SignatureInfo guarantee={guarantee} timezone={timezone} />
      </div>
    </div>
  );
}

function SignatureExpression({
  guarantee,
  comparator,
  onMetricSelected,
  selectedMetric,
}: {
  guarantee: IGuarantee;
  comparator: string;
  onMetricSelected: (metric: string | null) => void;
  selectedMetric: string | null;
}) {
  const expression = guarantee.numericExpression;
  const tokens = tokenizeExpression(expression);
  const metricNames = new Map(
    guarantee.metrics.map((metric, index) => [metric.metricName, index + 1]),
  );
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-1 flex-wrap gap-2">
        {tokens === null ? (
          <span>{expression}</span>
        ) : (
          tokens.map((token, index) => {
            return metricNames.has(token) ? (
              <Button
                variant={selectedMetric === token ? "default" : "primarySoft"}
                size="sm"
                key={index}
                onClick={() => {
                  onMetricSelected(selectedMetric === token ? null : token);
                }}
              >
                <span className="@2xl/main:hidden">
                  M{metricNames.get(token)}
                </span>
                <span className="hidden @2xl/main:inline">{token}</span>
              </Button>
            ) : (
              <span className="text-lg" key={index}>
                {token}
              </span>
            );
          })
        )}
      </div>
      <div className="flex gap-4">
        <Separator orientation="vertical" />
        <div className="flex items-center gap-2">
          <span className="font-medium text-xl">{comparator}</span>
          <div className="flex flex-col items-start">
            <span className="text-3xl font-bold">{guarantee.threshold}</span>
            <span className="text-xs text-muted-foreground">threshold</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignatureInfo({
  guarantee,
  timezone,
}: {
  guarantee: IGuarantee;
  timezone: string;
}) {
  const { window, evolutiveWindow } = guarantee;

  if (!evolutiveWindow) {
    return (
      <div className="flex flex-col gap-2 @xl/main:flex-row @xl/main:items-center @xl/main:gap-8">
        <div className="flex items-center gap-2">
          <Clock2 className="text-muted-foreground size-4" />
          <span className="text-muted-foreground">Evaluated every</span>
          {formatPeriod(window)}
        </div>
        <div className="flex items-center gap-2">
          <Pin className="text-muted-foreground size-4" />
          <span className="text-muted-foreground">Anchored at</span>
          {formatReadableDate(window.anchorDate, timezone)}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-3 @xl/main:grid-cols-[auto_auto_auto] @xl/main:justify-start @xl/main:gap-2">
      <Clock2 className="text-muted-foreground size-4" />
      <div className="flex flex-col gap-1 border-l pl-3 @xl/main:contents">
        <span>
          <span className="text-muted-foreground">Evaluated every</span>{" "}
          {formatPeriod(window)}
        </span>
        <span className="@xl/main:ml-6 @xl/main:border-l @xl/main:pl-8">
          <span className="text-muted-foreground">Tracked every</span>{" "}
          {formatPeriod(evolutiveWindow)}
        </span>
      </div>
      <Pin className="text-muted-foreground size-4" />
      <div className="flex flex-col gap-1 border-l pl-3 @xl/main:contents">
        <span>
          <span className="text-muted-foreground">Evaluation anchored at</span>{" "}
          {formatReadableDate(window.anchorDate, timezone)}
        </span>
        <span className="@xl/main:ml-6 @xl/main:border-l @xl/main:pl-8">
          <span className="text-muted-foreground">Tracking anchored at</span>{" "}
          {formatReadableDate(evolutiveWindow.anchorDate, timezone)}
        </span>
      </div>
    </div>
  );
}
