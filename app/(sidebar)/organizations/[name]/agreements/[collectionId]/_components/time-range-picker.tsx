"use client";

import { TransitionStartFunction, useState } from "react";
import { useQueryStates } from "nuqs";
import { format, sub } from "date-fns";
import { IconChevronDown } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  DateRangeInputs,
  validateDateRange,
} from "@/components/date/date-range-inputs";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  COMPACT_DATE_TIME_FORMAT,
  EXPAND_DATE_TIME_FORMAT,
} from "@/lib/utils/formatter";
import { agreementVersionSearchParams } from "../search-params";

const formatRange = (range: { from: Date; to: Date }) => ({
  from: format(range.from, EXPAND_DATE_TIME_FORMAT),
  to: format(range.to, EXPAND_DATE_TIME_FORMAT),
});

export function TimeRangePicker({
  range,
  validity,
  startTransition,
}: {
  range: { from: Date; to: Date };
  validity: { initial: Date; end: Date };
  startTransition: TransitionStartFunction;
}) {
  const [{ from, to }, setSearchParams] = useQueryStates(
    agreementVersionSearchParams,
  );
  const current = from && to ? { from, to } : range;
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState(() => formatRange(current));
  const { range: validRange, errors } = validateDateRange(inputs);

  const applyRange = (newRange: { from: Date; to: Date }) => {
    setSearchParams(newRange, { shallow: false, startTransition });
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) setInputs(formatRange(current));
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex-1">
          <span className="@4xl/main:hidden">
            {format(current.from, COMPACT_DATE_TIME_FORMAT)} to{" "}
            {format(current.to, COMPACT_DATE_TIME_FORMAT)}
          </span>
          <span className="hidden @4xl/main:inline">
            {format(current.from, EXPAND_DATE_TIME_FORMAT)} to{" "}
            {format(current.to, EXPAND_DATE_TIME_FORMAT)}
          </span>
          <IconChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="max-h-(--radix-popover-content-available-height) w-72 max-w-[calc(100vw-2rem)] overflow-y-auto lg:w-auto lg:max-w-none lg:flex-row"
      >
        <div className="flex w-full flex-col justify-between gap-4 pt-1 lg:w-72">
          <PopoverTitle>Absolute time range</PopoverTitle>
          <DateRangeInputs
            id="time-range"
            value={inputs}
            errors={errors}
            onChange={setInputs}
          />
          <Button
            disabled={!validRange}
            onClick={() => validRange && applyRange(validRange)}
          >
            Apply time range
          </Button>
        </div>
        <Separator
          orientation="vertical"
          className="max-lg:h-px max-lg:w-full!"
        />
        <div className="flex w-full flex-col gap-2 pt-1 lg:w-44">
          <PopoverTitle>Quick ranges</PopoverTitle>
          <div className="lg:relative lg:flex-1">
            <div className="flex max-h-36 flex-col overflow-y-auto lg:absolute lg:inset-0 lg:max-h-none">
              {[
                { label: "Agreement validity" },
                { label: "Last 5 minutes", duration: { minutes: 5 } },
                { label: "Last 15 minutes", duration: { minutes: 15 } },
                { label: "Last 30 minutes", duration: { minutes: 30 } },
                { label: "Last 1 hour", duration: { hours: 1 } },
                { label: "Last 3 hours", duration: { hours: 3 } },
                { label: "Last 6 hours", duration: { hours: 6 } },
                { label: "Last 12 hours", duration: { hours: 12 } },
                { label: "Last 24 hours", duration: { hours: 24 } },
                { label: "Last 2 days", duration: { days: 2 } },
                { label: "Last 7 days", duration: { days: 7 } },
                { label: "Last 30 days", duration: { days: 30 } },
                { label: "Last 90 days", duration: { days: 90 } },
                { label: "Last 6 months", duration: { months: 6 } },
                { label: "Last 1 year", duration: { years: 1 } },
              ].map(({ label, duration }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    const now = new Date();
                    applyRange(
                      duration
                        ? { from: sub(now, duration), to: now }
                        : { from: validity.initial, to: validity.end },
                    );
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
