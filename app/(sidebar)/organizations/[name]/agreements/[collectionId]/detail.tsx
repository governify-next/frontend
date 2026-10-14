"use client";

import { useState, useTransition } from "react";
import {
  CalculationState,
  IAgreementCollection,
  IAgreementVersion,
} from "@/types/agreement";
import { Result } from "@/lib/utils/fetcher";
import { getValidityEnd } from "@/lib/utils/validity";
import { IComplianceData, IComplianceState } from "@/types/compliance";
import { AgreementHeader } from "./_components/agreement-header";
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
  range,
  compliance,
  getState,
}: {
  orgName: string;
  collection: IAgreementCollection;
  calculationState: CalculationState;
  version: IAgreementVersion;
  range: { from: Date; to: Date };
  compliance: Promise<Result<IComplianceData>>;
  getState: (stateId: string) => Promise<Result<IComplianceState>>;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [isNavigating, startTransition] = useTransition();
  const { signatures } = version.contract;

  return (
    <div className="flex w-full flex-col gap-4 pt-4">
      <AgreementHeader
        orgName={orgName}
        range={range}
        validity={{
          initial: new Date(version.contract.validity.initial),
          end: getValidityEnd(version.contract.validity),
        }}
        isNavigating={isNavigating}
        startTransition={startTransition}
      />

      <div className="flex flex-col gap-4 md:px-3">
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
          range={range}
          compliance={compliance}
          getState={getState}
          startTransition={startTransition}
        />
      </div>
    </div>
  );
}
