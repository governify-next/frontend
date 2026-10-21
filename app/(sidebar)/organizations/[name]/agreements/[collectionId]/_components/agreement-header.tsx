"use client";

import { TransitionStartFunction, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { ChevronLeft, RefreshCw, ZoomOut } from "lucide-react";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TimeRangePicker } from "./time-range-picker";
import {
  agreementVersionSearchParams,
  REFRESH_INTERVALS,
  REFRESH_OPTIONS,
} from "../search-params";

export function AgreementHeader({
  orgName,
  range,
  validity,
  isNavigating,
  startTransition,
  onZoomOut,
}: {
  orgName: string;
  range: { from: Date; to: Date };
  validity: { initial: Date; end: Date };
  isNavigating: boolean;
  startTransition: TransitionStartFunction;
  onZoomOut?: () => void;
}) {
  const router = useRouter();
  const [{ showEvolutivePoints, refresh }, setSearchParams] = useQueryStates(
    agreementVersionSearchParams,
  );

  useEffect(() => {
    if (refresh === "Off" || isNavigating) return;
    const id = setTimeout(
      () => startTransition(() => router.refresh()),
      REFRESH_INTERVALS[refresh],
    );
    return () => clearTimeout(id);
  }, [refresh, isNavigating, router, startTransition]);

  return (
    <div className="-mx-4 flex flex-col gap-2 bg-background px-4 pt-2 pb-4 sticky top-0 z-10 lg:-mx-6 lg:px-6 @3xl/main:flex-row @3xl/main:flex-wrap @3xl/main:items-center">
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href={`/organizations/${orgName}/agreements`}>
            <ChevronLeft />
            <span className="@3xl/main:sr-only @5xl/main:not-sr-only">
              Back to agreements
            </span>
          </Link>
        </Button>
        <Label
          className={buttonVariants({
            variant: "outline",
            className: "flex-1 @3xl/main:flex-none",
          })}
        >
          Evolutive points
          <Switch
            checked={showEvolutivePoints}
            disabled={isNavigating}
            onCheckedChange={(checked) =>
              setSearchParams({ showEvolutivePoints: checked })
            }
          />
        </Label>
      </div>
      <div className="flex flex-col gap-2 @3xl/main:ml-auto @3xl/main:flex-row @3xl/main:items-center">
        <ButtonGroup className="w-full @3xl/main:w-fit">
          <TimeRangePicker
            range={range}
            validity={validity}
            startTransition={startTransition}
          />
          <Button
            variant="outline"
            size="icon"
            aria-label="Zoom out"
            title="Zoom out"
            disabled={!onZoomOut || isNavigating}
            onClick={onZoomOut}
          >
            <ZoomOut />
          </Button>
        </ButtonGroup>
        <ButtonGroup className="w-full @3xl/main:w-fit">
          <Button
            variant="outline"
            className="flex-1"
            disabled={isNavigating}
            onClick={() => startTransition(() => router.refresh())}
          >
            <RefreshCw className={isNavigating ? "animate-spin" : undefined} />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                aria-label="Auto refresh interval"
                disabled={isNavigating}
              >
                {refresh}
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {REFRESH_OPTIONS.map((option) => {
                const selected = option === refresh;

                return (
                  <DropdownMenuItem
                    key={option}
                    disabled={selected}
                    onClick={() => setSearchParams({ refresh: option })}
                  >
                    {option}
                    {selected && <IconCheck className="ml-auto" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>
    </div>
  );
}
