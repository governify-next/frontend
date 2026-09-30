"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CalculationState,
  IAgreementCollection,
  IAgreementVersion,
} from "@/types/agreement";
import { IDashboardData } from "@/types/dashboard";
import { useState } from "react";
import {
  AgreementCollectionEditCard,
  AgreementCollectionInfo,
} from "./_components/collection-info";
import { AgreementVersionInfo } from "./_components/version-info";

export function AgreementDetail({
  orgName,
  collection,
  calculationState,
  version,
  dashboard,
  range,
}: {
  orgName: string;
  collection: IAgreementCollection;
  calculationState: CalculationState;
  version: IAgreementVersion;
  dashboard: IDashboardData | null;
  range: { from: Date; to: Date };
}) {
  const [editOpen, setEditOpen] = useState(false);
  const { signatures } = version.contract;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" asChild>
          <Link href={`/organizations/${orgName}/agreements`}>
            <ChevronLeft />
            {/* Label dropped when the three controls no longer fit in one row. */}
            <span className="sr-only @xl/main:not-sr-only">
              Back to agreements
            </span>
          </Link>
        </Button>
      </div>

      {!editOpen && (
        <AgreementCollectionInfo
          collection={collection}
          onEdit={() => setEditOpen(true)}
        />
      )}
      {editOpen && (
        <AgreementCollectionEditCard
          orgName={orgName}
          collection={collection}
          onOpenChange={setEditOpen}
        />
      )}

      <AgreementVersionInfo
        collection={collection}
        version={version}
        orgName={orgName}
        calculationState={calculationState}
        signatures={signatures}
        dashboard={dashboard}
        range={range}
      />
    </div>
  );
}
