"use client";

import { Suspense, use } from "react";
import { useQueryStates } from "nuqs";

import {
  ComplianceGauge,
  SignatureComplianceChart,
  TimelineChart,
} from "@/components/echarts/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ISignature } from "@/types/agreement";
import { IComplianceData } from "@/types/compliance";
import { Spinner } from "@/components/ui/spinner";
import { Result } from "@/lib/utils/fetcher";
import { agreementVersionSearchParams } from "../search-params";

export function GuaranteeCharts({
  signatures,
  guaranteeName,
  validity,
  versionNumber,
  range,
  compliance,
}: {
  signatures: ISignature[];
  guaranteeName: string;
  validity: { initial: Date; end: Date };
  versionNumber: number;
  range: { from: Date; to: Date };
  compliance: Promise<Result<IComplianceData>>;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 pb-4">
        <span className="text-xs font-medium uppercase text-muted-foreground">
          Compliance
        </span>
        <Separator className="shrink" />
      </div>
      <Suspense
        key={versionNumber}
        fallback={
          <div className="flex justify-center py-8">
            <Spinner className="size-6 text-muted-foreground" />
          </div>
        }
      >
        <ComplianceCharts
          signatures={signatures}
          guaranteeName={guaranteeName}
          validity={validity}
          range={range}
          compliance={compliance}
        />
      </Suspense>
    </div>
  );
}

function ComplianceCharts({
  signatures,
  guaranteeName,
  validity,
  range,
  compliance,
}: {
  signatures: ISignature[];
  guaranteeName: string;
  validity: { initial: Date; end: Date };
  range: { from: Date; to: Date };
  compliance: Promise<Result<IComplianceData>>;
}) {
  const result = use(compliance);
  const [{ showEvolutivePoints }] = useQueryStates(
    agreementVersionSearchParams,
  );

  if (!result.ok) {
    return (
      <span className="text-muted-foreground">
        Something went wrong while loading the compliance data.
      </span>
    );
  }

  const data = result.data[guaranteeName] ?? {
    allTime: null,
    selectedPeriod: null,
    bySignature: [],
    points: [],
  };

  return (
    <div className="flex flex-col gap-4 px-1">
      <div className="grid grid-cols-1 gap-4 @4xl/main:grid-cols-[18rem_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Compliance</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="@container">
              <div className="grid grid-cols-1 @sm:grid-cols-2">
                <ComplianceGauge value={data.allTime} label="All time" />
                <ComplianceGauge
                  value={data.selectedPeriod}
                  label="Selected period"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <TimelineChart
              range={range}
              validity={validity}
              threshold={{
                value: signatures[0].guarantee.threshold,
                comparator: signatures[0].guarantee.comparator,
              }}
              series={signatures.map((signature) => ({
                name: signature.visualizationConfig.label,
                data: data.points.filter(
                  (point) =>
                    point.signatureId === signature.signatureId &&
                    (showEvolutivePoints || point.consolidated),
                ),
              }))}
            />
          </CardContent>
        </Card>
      </div>
      {signatures.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Signature compliance</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <SignatureComplianceChart
              rows={signatures.map((signature) => {
                const row = data.bySignature.find(
                  ({ signatureId }) => signatureId === signature.signatureId,
                );
                return {
                  label: signature.visualizationConfig.label,
                  allTime: row?.allTime ?? null,
                  selectedPeriod: row?.selectedPeriod ?? null,
                };
              })}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
