"use client";

import { useState, useTransition } from "react";
import { useQueryStates } from "nuqs";
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
import { agreementVersionSearchParams } from "./search-params";

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
  const [, setSearchParams] = useQueryStates(agreementVersionSearchParams);
  const [zooms, setZooms] = useState<
    { previous: { from: Date; to: Date }; zoomed: { from: Date; to: Date } }[]
  >([]);
  const { signatures } = version.contract;
  const lastZoom = zooms.at(-1);
  const zoomsActive =
    lastZoom?.zoomed.from.getTime() === range.from.getTime() &&
    lastZoom.zoomed.to.getTime() === range.to.getTime();

  const applyRange = (newRange: { from: Date; to: Date }) =>
    setSearchParams(newRange, { shallow: false, startTransition });

  const onZoom = (zoomed: { from: Date; to: Date }) => {
    setZooms((current) => [
      ...(zoomsActive ? current : []),
      { previous: range, zoomed },
    ]);
    applyRange(zoomed);
  };

  const onZoomOut =
    lastZoom && zoomsActive
      ? () => {
          setZooms((current) => current.slice(0, -1));
          applyRange(lastZoom.previous);
        }
      : undefined;

  return (
    <div className="flex w-full flex-col gap-4">
      <AgreementHeader
        orgName={orgName}
        range={range}
        validity={{
          initial: new Date(version.contract.validity.initial),
          end: getValidityEnd(version.contract.validity),
        }}
        isNavigating={isNavigating}
        startTransition={startTransition}
        onZoomOut={onZoomOut}
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
          onZoom={onZoom}
        />
      </div>
    </div>
  );
}
