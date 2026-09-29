"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import { IconCheck, IconChevronDown, IconRepeatOff } from "@tabler/icons-react";
import {
  ArrowRight,
  Ban,
  CalendarSync,
  Globe,
  Minus,
  PlayIcon,
  PowerOff,
} from "lucide-react";

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
import {
  CalculationState,
  IAgreementCollection,
  IAgreementVersion,
  ISignature,
} from "@/types/agreement";
import { formatReadableDate } from "@/lib/utils/formatter";
import {
  generateStatesForVersion,
  terminateAgreementVersion,
  toggleAutomaticTrackingForVersion,
} from "@/data/agreements/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ManualStatesDialog } from "./manual-states-dialog";
import { AgreementVersionSignatures } from "./signatures";

export function AgreementVersionInfo({
  collection,
  version,
  orgName,
  calculationState,
  signatures,
}: {
  collection: IAgreementCollection;
  version: IAgreementVersion;
  orgName: string;
  calculationState: CalculationState;
  signatures: ISignature[];
}) {
  const router = useRouter();
  const [, setSelectedNumber] = useQueryState(
    "version",
    parseAsInteger.withOptions({ shallow: false }), // we need to call the server again to update the tasks version info
  );
  const [openTerminateDialog, setOpenTerminateDialog] = useState(false);
  const [openFetchStatesDialog, setOpenFetchStatesDialog] = useState(false);

  const versions = collection.agreementVersions;
  const activeNumber = collection.auditableVersionNumber;
  const isActive = version.versionNumber === activeNumber;

  // Check if version is terminated for showing the toggle buttons
  const earlyTermination = version.contract.validity.earlyTermination
    ? new Date(version.contract.validity.earlyTermination)
    : null;
  const contractEnd = new Date(version.contract.validity.end);
  const end =
    earlyTermination && earlyTermination < contractEnd
      ? earlyTermination
      : contractEnd;

  const enabledToggle = end > new Date();

  const handleToggle = async (start: boolean, refresh = true) => {
    const result = await toggleAutomaticTrackingForVersion(
      start,
      orgName,
      collection.scopeId,
      collection._id,
      version.versionNumber,
    );
    if (!result.ok) {
      toast.error(
        `Failed to ${start ? "start" : "stop"} tracking. Please try again.`,
      );
      router.refresh();
      return false;
    }
    if (refresh) {
      router.refresh();
      toast.success(`Tracking ${start ? "started" : "stopped"} successfully.`);
    }
    return true;
  };

  const handleTerminateVersion = async () => {
    // Ensure calculations are stopped
    if (!(await handleToggle(false, false))) return;

    const result = await terminateAgreementVersion(
      orgName,
      collection.scopeId,
      collection._id,
    );
    if (!result.ok) {
      toast.error("Failed to terminate the active version. Please try again.");
      return;
    }
    toast.success(`Version ${version.versionNumber} terminated successfully.`);
    router.refresh();
  };

  const groupedSignatures = Map.groupBy(
    signatures,
    (signature) => signature.guarantee.name,
  );

  const generateStates = async (data: {
    startDate: Date;
    endDate: Date;
    replaceExisting: boolean;
  }) => {
    const result = await generateStatesForVersion(
      orgName,
      collection.scopeId,
      collection._id,
      version.versionNumber,
      data,
    );
    if (!result.ok) {
      toast.error("Failed to collect data. Please try again.");
      return false;
    }
    toast.success(`Data collected successfully.`);
    router.refresh();
    return true;
  };

  const enableRunningOptions =
    enabledToggle &&
    (calculationState === CalculationState.ALL_TASKS_ENABLED ||
      calculationState === CalculationState.SOME_TASKS_DISABLED);

  return (
    <>
      <Card className="pt-0">
        <CardHeader className="flex items-center justify-between border-b bg-muted/50 pt-4 pb-4! ">
          <div className="flex items-center gap-2">
            <CardTitle className="hidden @4xl/main:inline">Viewing</CardTitle>
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
            <CardTitle className="hidden @4xl/main:inline">
              of {collection.agreementVersions.length}
            </CardTitle>
          </div>
          <div className="flex flex-col gap-2 @xl/main:flex-row @xl/main:items-center">
            {enabledToggle && (
              <div className="items-center gap-2 hidden @3xl/main:flex">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    calculationState === CalculationState.NO_TASKS
                      ? "bg-red-600"
                      : "bg-green-600",
                  )}
                  aria-hidden
                />
                <span className="text-xs text-muted-foreground">
                  {calculationState === CalculationState.NO_TASKS
                    ? "No tasks running"
                    : calculationState === CalculationState.ALL_TASKS_ENABLED
                      ? "All tasks running"
                      : "Some tasks running"}
                </span>
              </div>
            )}
            {enabledToggle &&
              calculationState === CalculationState.NO_TASKS && (
                <Button variant="outline" onClick={() => handleToggle(true)}>
                  <CalendarSync />
                  Start tracking
                </Button>
              )}
            {enableRunningOptions && (
              <Button variant="outline" onClick={() => handleToggle(false)}>
                <IconRepeatOff />
                Stop tracking
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setOpenFetchStatesDialog(true)}
            >
              <PlayIcon />
              Track period
            </Button>
            {isActive && (
              <Button
                variant="destructive"
                onClick={() => setOpenTerminateDialog(true)}
              >
                <PowerOff className="size-4" />
                <span>Terminate version</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="border-b pb-(--card-spacing)">
          <AgreementVersionDetails version={version} />
        </CardContent>
        <div>
          <CardHeader>
            <div className="flex flex-col gap-2 @2xl/main:flex-row @2xl/main:items-center @2xl/main:gap-1">
              <div className="flex items-center gap-1">
                <CardTitle>Guarantees</CardTitle>
                <Badge variant="secondary">{groupedSignatures.size}</Badge>
              </div>
              <Minus
                className="size-4 text-muted-foreground hidden @2xl/main:inline"
                strokeWidth={2}
              />
              <CardDescription>
                Here you can find the guarantees included in this agreement
                version. Click on one to see its objective and metrics.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <AgreementVersionSignatures
              groupedSignatures={groupedSignatures}
              timezone={version.contract.validity.timezone}
            />
          </CardContent>
        </div>
      </Card>
      <ConfirmDialog
        open={openTerminateDialog}
        onOpenChange={() => setOpenTerminateDialog(false)}
        title="Terminate the active version?"
        icon={<Ban />}
        description="This will terminate the currently auditable version."
        onConfirm={handleTerminateVersion}
        confirmText="Confirm"
      />
      <ManualStatesDialog
        open={openFetchStatesDialog}
        onOpenChange={setOpenFetchStatesDialog}
        onGenerate={generateStates}
      />
    </>
  );
}

function AgreementVersionDetails({ version }: { version: IAgreementVersion }) {
  const validity = version.contract.validity;
  return (
    <div className="grid grid-cols-1 gap-8 @4xl/main:grid-cols-[1fr_2fr_1fr]">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase text-muted-foreground">
            Template
          </span>
          <span>{version.contract.agreementTemplateName}</span>
        </div>
        <Separator orientation="vertical" className="hidden @4xl/main:block" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase text-muted-foreground">
            Validity
          </span>
          <div className="flex items-center gap-2">
            <span>
              {formatReadableDate(validity.initial, validity.timezone)}
            </span>
            <ArrowRight className="size-4 text-muted-foreground" />
            <span>{formatReadableDate(validity.end, validity.timezone)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Globe className="size-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              {validity.timezone}
            </span>
          </div>
        </div>
        <Separator orientation="vertical" className="hidden @4xl/main:block" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase text-muted-foreground">
          Early Termination
        </span>
        <span>
          {formatReadableDate(
            validity.earlyTermination,
            validity.timezone,
            "None",
          )}
        </span>
      </div>
    </div>
  );
}
