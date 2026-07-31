"use client";
import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { ChevronLeft, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IAgreementCollection } from "@/types/agreement";
import { formatReadableDate } from "@/lib/utils/formatDates";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="break-all">{value}</dd>
    </div>
  );
}

export function AgreementDetail({
  orgName,
  collection,
}: {
  orgName: string;
  collection: IAgreementCollection;
}) {
  const [selected, setSelected] = useQueryState("version", parseAsInteger);

  const versions = collection.agreementVersions;
  const activeNumber = collection.auditableVersionNumber;

  // Default view: the active version, or the highest one when none is active.
  const fallback =
    versions.find((version) => version.versionNumber === activeNumber) ??
    versions.reduce((max, version) =>
      version.versionNumber > max.versionNumber ? version : max,
    );
  const version =
    versions.find((candidate) => candidate.versionNumber === selected) ??
    fallback;

  const { agreementTemplateId, validity, signaturesId } = version.contract;
  const isActive = version.versionNumber === activeNumber;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" asChild>
          <Link href={`/organizations/${orgName}/agreements`}>
            <ChevronLeft />
            Back to agreements
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Version {version.versionNumber}
              {isActive && <Badge variant="secondary">Active</Badge>}
              <IconChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto">
            {[...versions]
              .sort((a, b) => b.versionNumber - a.versionNumber)
              .map((candidate, index) => {
                const selected =
                  candidate.versionNumber === version.versionNumber;

                return (
                  <DropdownMenuItem
                    // Index as key: version numbers can repeat, see the note below.
                    key={index}
                    disabled={selected}
                    onClick={() => setSelected(candidate.versionNumber)}
                  >
                    Version {candidate.versionNumber}
                    <span className="ml-auto flex items-center gap-2">
                      {candidate.versionNumber === activeNumber && (
                        <Badge variant="secondary">Active</Badge>
                      )}
                      {selected && <IconCheck />}
                    </span>
                  </DropdownMenuItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button>
          <Play />
          Start calculations
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{collection.displayName || collection.name}</CardTitle>
          <CardDescription>
            Basic information about version {version.versionNumber} of this
            agreement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm @2xl/main:grid-cols-2">
            <Field label="Template" value={agreementTemplateId} />
            <Field label="Timezone" value={validity.timezone} />
            <Field
              label="Starts"
              value={formatReadableDate(validity.initial)}
            />
            <Field label="Ends" value={formatReadableDate(validity.end)} />
            <Field
              label="Early termination"
              value={formatReadableDate(validity.earlyTermination)}
            />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Signatures</CardTitle>
          <CardDescription>
            This version has {signaturesId.length} signatures.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
