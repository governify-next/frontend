"use client";

import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { ChevronLeft, Pause, Play } from "lucide-react";

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
import { IAgreementCollection, IAgreementVersion } from "@/types/agreement";
import { formatReadableDate } from "@/lib/utils/formatDates";
import { toggleConsolidationStateTasksForVersion } from "@/data/agreements/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  hasTasks,
  version,
}: {
  orgName: string;
  collection: IAgreementCollection;
  hasTasks: boolean;
  version: IAgreementVersion;
}) {
  const router = useRouter();
  const [, setSelectedNumber] = useQueryState(
    "version",
    parseAsInteger.withOptions({ shallow: false }), // we need to call the server again to update the tasks version info
  );

  const versions = collection.agreementVersions;
  const activeNumber = collection.auditableVersionNumber;

  const { agreementTemplateId, validity, signaturesId } = version.contract;
  const isActive = version.versionNumber === activeNumber;

  const handleToggle = async () => {
    const result = await toggleConsolidationStateTasksForVersion(
      !hasTasks,
      orgName,
      collection.scopeId,
      collection._id,
      version.versionNumber,
    );
    if (!result.ok) {
      toast.error("Failed to toggle calculations. Please try again.");
      return;
    }
    router.refresh();
    toast.success(
      `Calculations ${!hasTasks ? "started" : "stopped"} successfully.`,
    );
  };

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

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Version {version.versionNumber}
                {isActive && <Badge variant="secondary">Active</Badge>}
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto">
              {[...versions].reverse().map((candidate) => {
                const isCurrent =
                  candidate.versionNumber === version.versionNumber;

                return (
                  <DropdownMenuItem
                    key={candidate.versionNumber}
                    disabled={isCurrent}
                    onClick={() => setSelectedNumber(candidate.versionNumber)}
                  >
                    Version {candidate.versionNumber}
                    <span className="ml-auto flex items-center gap-2">
                      {candidate.versionNumber === activeNumber && (
                        <Badge variant="secondary">Active</Badge>
                      )}
                      {isCurrent && <IconCheck />}
                    </span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleToggle}>
            {hasTasks ? <Pause /> : <Play />}
            {hasTasks ? "Stop" : "Start"} calculations
          </Button>
        </div>
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
              value={formatReadableDate(validity.earlyTermination, "None")}
            />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Guarantees</CardTitle>
          <CardDescription>
            This version has {signaturesId.length} signatures.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
