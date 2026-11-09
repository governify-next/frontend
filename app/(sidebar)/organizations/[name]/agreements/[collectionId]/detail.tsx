"use client";

import { useState, useTransition } from "react";
import { useQueryStates } from "nuqs";
import {
  CalculationState,
  CollectionPermission,
  IAgreementCollectionWithActions,
  IAgreementVersion,
  ICollectionPermissions,
} from "@/types/agreement";
import { IRole } from "@/types/organization";
import { Result } from "@/lib/utils/fetcher";
import { getValidityEnd } from "@/lib/utils/validity";
import { IComplianceData, IComplianceState } from "@/types/compliance";
import { AgreementHeader } from "./_components/agreement-header";
import { AgreementCollectionDetails } from "./_components/collection-info";
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
  roles,
  permissions,
}: {
  orgName: string;
  collection: IAgreementCollectionWithActions;
  calculationState: CalculationState;
  version: IAgreementVersion;
  range: { from: Date; to: Date };
  compliance: Promise<Result<IComplianceData>>;
  getState: (stateId: string) => Promise<Result<IComplianceState>>;
  roles: IRole[];
  permissions: ICollectionPermissions | null;
}) {
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
        canViewEvolutive={
          collection.allowedActions[CollectionPermission.VIEW_EVOLUTIVE]
        }
        isNavigating={isNavigating}
        startTransition={startTransition}
        onZoomOut={onZoomOut}
      />

      <div className="flex flex-col gap-4 md:px-3">
        <AgreementCollectionDetails
          orgName={orgName}
          collection={collection}
          roles={roles}
          permissions={permissions}
        />

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
