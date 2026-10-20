"use client";

import { TransitionStartFunction, useState } from "react";
import { useQueryStates } from "nuqs";
import { endOfDay, format, isValid, parse, sub } from "date-fns";
import type { DateRange } from "react-day-picker";
import { IconChevronDown } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { CalendarDays } from "lucide-react";
import {
  COMPACT_DATE_TIME_FORMAT,
  EXPAND_DATE_TIME_FORMAT,
} from "@/lib/utils/formatter";
import { agreementVersionSearchParams } from "../search-params";

const INVALID_DATE_ERROR = `Invalid date, use ${EXPAND_DATE_TIME_FORMAT}`;

const formatRange = (range: { from: Date; to: Date }) => ({
  from: format(range.from, EXPAND_DATE_TIME_FORMAT),
  to: format(range.to, EXPAND_DATE_TIME_FORMAT),
});

const validateRange = (inputs: { from: string; to: string }) => {
  const from = parse(inputs.from, EXPAND_DATE_TIME_FORMAT, new Date());
  const to = parse(inputs.to, EXPAND_DATE_TIME_FORMAT, new Date());
  const errors = {
    from: !isValid(from)
      ? INVALID_DATE_ERROR
      : isValid(to) && from.getTime() >= to.getTime()
        ? '"From" must be earlier than "To"'
        : null,
    to: isValid(to) ? null : INVALID_DATE_ERROR,
  };
  return { range: errors.from || errors.to ? null : { from, to }, errors };
};

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
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selected, setSelected] = useState<DateRange>(current);
  const [inputs, setInputs] = useState(() => formatRange(current));
  const { range: validRange, errors } = validateRange(inputs);

  const closeCalendar = () => {
    setCalendarOpen(false);
    if (!selected.to) setSelected(validRange ?? current);
  };

  const applyRange = (newRange: { from: Date; to: Date }) => {
    setSearchParams(newRange, { shallow: false, startTransition });
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          setSelected(current);
          setInputs(formatRange(current));
        } else {
          setCalendarOpen(false);
        }
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
        {calendarOpen && (
          <>
            <Calendar
              mode="range"
              required
              resetOnSelect
              selected={selected}
              onSelect={(newRange) => {
                setSelected(newRange);
                if (newRange.from && newRange.to) {
                  setInputs(
                    formatRange({
                      from: newRange.from,
                      to: endOfDay(newRange.to),
                    }),
                  );
                }
              }}
              defaultMonth={selected.to}
              className="p-0 max-lg:self-center"
            />
            <Separator
              orientation="vertical"
              className="max-lg:h-px max-lg:w-full!"
            />
          </>
        )}
        <div className="flex w-full flex-col justify-between gap-4 pt-1 lg:w-72">
          <PopoverTitle>Absolute time range</PopoverTitle>
          <FieldGroup className="gap-4">
            {(
              [
                { id: "from", label: "From" },
                { id: "to", label: "To" },
              ] as const
            ).map(({ id, label }) => (
              <Field key={id} data-invalid={!!errors[id]}>
                <FieldLabel htmlFor={`time-range-${id}`}>{label}</FieldLabel>
                <ButtonGroup className="w-full">
                  <Input
                    id={`time-range-${id}`}
                    value={inputs[id]}
                    aria-invalid={!!errors[id]}
                    className="aria-invalid:relative aria-invalid:z-10"
                    onFocus={closeCalendar}
                    onChange={(e) => {
                      const next = { ...inputs, [id]: e.target.value };
                      setInputs(next);
                      const parsed = validateRange(next).range;
                      if (parsed) setSelected(parsed);
                    }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={`Open calendar for ${label}`}
                    aria-pressed={calendarOpen}
                    onClick={() =>
                      calendarOpen ? closeCalendar() : setCalendarOpen(true)
                    }
                  >
                    <CalendarDays />
                  </Button>
                </ButtonGroup>
                {errors[id] && <FieldError>{errors[id]}</FieldError>}
              </Field>
            ))}
          </FieldGroup>
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
