"use client";

import { TransitionStartFunction, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { ChevronLeft, RefreshCw } from "lucide-react";
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
}: {
  orgName: string;
  range: { from: Date; to: Date };
  validity: { initial: Date; end: Date };
  isNavigating: boolean;
  startTransition: TransitionStartFunction;
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
    <div className="-mx-4 flex flex-wrap items-center gap-2 bg-background px-4 pt-2 pb-4 md:sticky md:top-0 md:z-10 lg:-mx-6 lg:px-6">
      <Button variant="outline" asChild>
        <Link href={`/organizations/${orgName}/agreements`}>
          <ChevronLeft />
          <span className="sr-only @xl/main:not-sr-only">
            Back to agreements
          </span>
        </Link>
      </Button>
      <Label className={buttonVariants({ variant: "outline" })}>
        Evolutive points
        <Switch
          checked={showEvolutivePoints}
          disabled={isNavigating}
          onCheckedChange={(checked) =>
            setSearchParams({ showEvolutivePoints: checked })
          }
        />
      </Label>
      <div className="ml-auto flex items-center gap-2">
        <TimeRangePicker
          range={range}
          validity={validity}
          startTransition={startTransition}
        />
        <ButtonGroup>
          <Button
            variant="outline"
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
