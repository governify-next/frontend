"use client";

import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";
import {
  IconCheck,
  IconChevronDown,
  IconEdit,
  IconRepeatOff,
} from "@tabler/icons-react";
import {
  ArrowRight,
  Ban,
  CalendarSync,
  ChevronLeft,
  Clock2,
  Globe,
  Info,
  Magnet,
  Minus,
  Pause,
  Pin,
  Play,
  PowerOff,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  IGuarantee,
  IMetric,
  ISignature,
} from "@/types/agreement";
import { breakOnUnderscore, formatReadableDate } from "@/lib/utils/formatter";
import {
  generateStatesForVersion,
  terminateAgreementVersion,
  toggleConsolidationStateTasksForVersion,
  updateAgreementCollection,
} from "@/data/agreements/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { useAppForm } from "@/components/form";
import { collectionFormSchema } from "@/schemas/collection";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchStatesFormSchema } from "@/schemas/agreement";

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

export function AgreementDetail({
  orgName,
  collection,
  calculationState,
  version,
}: {
  orgName: string;
  collection: IAgreementCollection;
  calculationState: CalculationState;
  version: IAgreementVersion;
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
      />
    </div>
  );
}

function AgreementCollectionInfo({
  collection,
  onEdit,
}: {
  collection: IAgreementCollection;
  onEdit: () => void;
}) {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-2xl">
            {collection.displayName.toUpperCase() ||
              collection.name.toUpperCase()}
          </span>
          <Button variant="primarySoft" size="icon-sm" onClick={onEdit}>
            <IconEdit />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          {collection.description}
        </span>
      </div>
    </div>
  );
}

function AgreementCollectionEditCard({
  orgName,
  collection,
  onOpenChange,
}: {
  orgName: string;
  collection: IAgreementCollection;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      displayName: collection.displayName,
      name: collection.name,
      description: collection.description,
    },
    validators: {
      onSubmit: collectionFormSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        name: value.name,
        displayName: value.displayName,
        description: value.description,
      };
      const result = await updateAgreementCollection(
        orgName,
        collection._id,
        collection.auditableVersionNumber,
        payload,
      );

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Agreement collection updated.");
      onOpenChange(false);
      router.refresh();
    },
  });

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Editing collection details</CardTitle>
        <CardDescription>
          Make changes to the agreement collection here. Click save when
          you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="update-collection-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-4">
            <div className="grid grid-cols-1 gap-4 @2xl/main:grid-cols-2 @2xl/main:gap-10">
              <div className="flex flex-col gap-2">
                <form.AppField name="displayName">
                  {(field) => <field.TextField label="Display name" />}
                </form.AppField>
                <FieldDescription className="flex items-center gap-1">
                  <Info className="size-4" />
                  <span>Descriptive title of the collection.</span>
                </FieldDescription>
              </div>
              <div className="flex flex-col gap-2">
                <form.AppField name="name">
                  {(field) => <field.TextField label="Name" />}
                </form.AppField>
                <FieldDescription className="flex items-center gap-1">
                  <Info className="size-4" />
                  <span>Identifier used internally in the system.</span>
                </FieldDescription>
              </div>
            </div>

            <form.AppField name="description">
              {(field) => <field.TextareaField label="Description" />}
            </form.AppField>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <form.AppForm>
          <form.SubmitButton
            label="Save changes"
            formId="update-collection-form"
          />
        </form.AppForm>
      </CardFooter>
    </Card>
  );
}

function AgreementVersionInfo({
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
    const result = await toggleConsolidationStateTasksForVersion(
      start,
      orgName,
      collection.scopeId,
      collection._id,
      version.versionNumber,
    );
    if (!result.ok) {
      toast.error("Failed to toggle calculations. Please try again.");
      return;
    }
    if (refresh) {
      router.refresh();
      toast.success(
        `Calculations ${start ? "started" : "stopped"} successfully.`,
      );
    }
  };

  const handleTerminateVersion = async () => {
    // Ensure calculations are stopped
    await handleToggle(false, false);

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
      toast.error("Failed to generate states. Please try again.");
      return false;
    }
    toast.success(`States generated successfully.`);
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
            {enableRunningOptions && (
              <div className="items-center gap-2 hidden @3xl/main:flex">
                <span
                  className="size-1.5 rounded-full bg-green-600"
                  aria-hidden
                />
                <span className="text-xs text-muted-foreground">
                  {calculationState === CalculationState.ALL_TASKS_ENABLED
                    ? "All tasks running"
                    : "Some tasks running"}
                </span>
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <span>Calculation management</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto">
                {enabledToggle &&
                  calculationState === CalculationState.NO_TASKS && (
                    <DropdownMenuItem onSelect={() => handleToggle(true)}>
                      <CalendarSync />
                      Start recurring tasks
                    </DropdownMenuItem>
                  )}
                {enableRunningOptions && (
                  <DropdownMenuItem onSelect={() => handleToggle(false)}>
                    <IconRepeatOff />
                    Stop recurring tasks
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onSelect={() => setOpenFetchStatesDialog(true)}
                >
                  <Magnet />
                  Manual generation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        deleteText="Confirm"
      />
      <ManualStatesDialog
        open={openFetchStatesDialog}
        onOpenChange={setOpenFetchStatesDialog}
        onGenerate={generateStates}
      />
    </>
  );
}

function ManualStatesDialog({
  open,
  onOpenChange,
  onGenerate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (data: {
    startDate: Date;
    endDate: Date;
    replaceExisting: boolean;
  }) => Promise<boolean>;
}) {
  const form = useAppForm({
    defaultValues: {
      startDate: null as Date | null,
      endDate: null as Date | null,
      replaceExisting: false,
    },
    validators: {
      onSubmit: fetchStatesFormSchema,
    },
    onSubmit: async ({ value }) => {
      const success = await onGenerate({
        startDate: value.startDate as Date,
        endDate: value.endDate as Date,
        replaceExisting: value.replaceExisting,
      });
      if (success) {
        form.reset();
        onOpenChange(false);
      }
    },
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate calculations</DialogTitle>
          <DialogDescription>
            Fill in the details to generate calculations now. Click confirm when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form
          id="fetch-states-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-4">
            <div className="flex flex-col gap-3">
              <form.AppField
                name="startDate"
                children={(field) => (
                  <field.DatePickerField label="Start Date" />
                )}
              />

              <form.AppField
                name="endDate"
                children={(field) => <field.DatePickerField label="End Date" />}
              />
            </div>

            <form.AppField name="replaceExisting">
              {(field) => <field.CheckboxField label="Replace existing data" />}
            </form.AppField>
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => form.reset()}>
              Cancel
            </Button>
          </DialogClose>
          <form.AppForm>
            <form.SubmitButton label="Generate" formId="fetch-states-form" />
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

function AgreementVersionSignatures({
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
                  {firstSignature.guarantee.window.period.map(
                    (period, index) => {
                      return (
                        <span key={index}>
                          {period.value} {period.unit}
                          {index <
                          firstSignature.guarantee.window.period.length - 1
                            ? ","
                            : ""}
                        </span>
                      );
                    },
                  )}
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
                  selectedMetric === token
                    ? onMetricSelected(null)
                    : onMetricSelected(token);
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
  return (
    <div className="flex items-center">
      <div className="flex flex-col gap-2 @xl/main:flex-row @xl/main:items-center @xl/main:gap-8">
        <div className="flex items-center gap-2">
          <Clock2 className="text-muted-foreground size-4" />
          <span className="text-muted-foreground">Evaluated every </span>
          {guarantee.window.period.map((period, index) => {
            return (
              <span key={index}>
                {period.value} {period.unit}
                {index < guarantee.window.period.length - 1 ? "," : ""}
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <Pin className="text-muted-foreground size-4" />
          <span className="text-muted-foreground">Anchored at </span>
          {formatReadableDate(guarantee.window.anchorDate, timezone)}
        </div>
      </div>
    </div>
  );
}
function SignatureMetrics({
  signatures,
  selectedMetric,
}: {
  signatures: ISignature[];
  selectedMetric: string | null;
}) {
  const [selectedSignatureId, setSelectedSignatureId] = useState<string>(
    signatures[0].signatureId,
  );
  const selectedSignature = signatures.find(
    (signature) => signature.signatureId === selectedSignatureId,
  );
  const metrics = selectedSignature!.guarantee.metrics;
  // "flex flex-col gap-2 @lg/main:flex-row @lg/main:items-center @lg/main:gap-2 pb-4"
  return (
    <div>
      <div
        className={cn(
          signatures.length > 1
            ? "flex flex-col gap-2 @lg/main:flex-row @lg/main:items-center @lg/main:gap-2 pb-4"
            : "flex items-center gap-2 pb-4",
        )}
      >
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium uppercase text-muted-foreground">
            Metrics
          </span>
          <Badge variant="muted">{metrics.length}</Badge>
        </div>
        <Separator
          className={cn(
            "shrink",
            signatures.length > 1 && "hidden @lg/main:block",
          )}
        />
        {signatures.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="primarySoft" size="sm">
                <span>#{selectedSignatureId}</span>
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
                    #{signature.signatureId}
                    <span>{isCurrent && <IconCheck />}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 px-1 @4xl/main:grid-cols-2">
        {metrics.map((metric, index) => (
          <MetricCard
            metric={metric}
            index={index + 1}
            key={metric.metricName}
            disabled={selectedMetric !== metric.metricName}
          />
        ))}
      </div>
    </div>
  );
}

function MetricCard({
  metric,
  index,
  disabled,
}: {
  metric: IMetric;
  disabled: boolean;
  index: number;
}) {
  const hasFilters =
    Object.entries(metric.metricConfig.event.processConfig).length > 0;
  const hasConfiguration =
    metric.metricConfig.event.fetcherConfigs
      .map((fetcher) => Object.entries(fetcher.fetcherConfig))
      .flat().length > 0;
  return (
    <Card
      className={cn(
        "gap-3 transition-opacity",
        disabled && "opacity-50",
        !disabled &&
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
              {Object.entries(metric.metricConfig.event.processConfig).map(
                ([key, value]) => {
                  return (
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
                  );
                },
              )}
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
                    {Object.entries(fetcher.fetcherConfig).map(
                      ([key, value]) => {
                        return (
                          <div key={key} className="flex items-baseline gap-2">
                            <span className="text-muted-foreground">
                              {key}:{" "}
                            </span>
                            <span className="wrap-anywhere">
                              {typeof value === "string"
                                ? value
                                : JSON.stringify(value)}
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <span>This metric has no configuration</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
