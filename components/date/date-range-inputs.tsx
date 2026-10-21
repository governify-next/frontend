"use client";

import { isValid, parse } from "date-fns";

import { DateTimeInput } from "@/components/date/date-time-input";
import { FieldGroup } from "@/components/ui/field";
import { EXPAND_DATE_TIME_FORMAT } from "@/lib/utils/formatter";

type DateRangeValue = { from: string; to: string };

const INVALID_DATE_ERROR = `Invalid date, use ${EXPAND_DATE_TIME_FORMAT}`;

export const validateDateRange = (
  inputs: DateRangeValue,
  { disableFuture = false } = {},
) => {
  const from = parse(inputs.from, EXPAND_DATE_TIME_FORMAT, new Date());
  const to = parse(inputs.to, EXPAND_DATE_TIME_FORMAT, new Date());
  const errors = {
    from: !inputs.from
      ? null
      : !isValid(from)
        ? INVALID_DATE_ERROR
        : isValid(to) && from.getTime() >= to.getTime()
          ? '"From" must be earlier than "To"'
          : null,
    to: !inputs.to
      ? null
      : !isValid(to)
        ? INVALID_DATE_ERROR
        : disableFuture && to.getTime() > new Date().getTime()
          ? '"To" can\'t be in the future'
          : null,
  };
  return {
    range:
      isValid(from) && isValid(to) && !errors.from && !errors.to
        ? { from, to }
        : null,
    errors,
  };
};

export function DateRangeInputs({
  id,
  value,
  errors,
  onChange,
  disableFuture = false,
}: {
  id: string;
  value: DateRangeValue;
  errors: { from: string | null; to: string | null };
  onChange: (value: DateRangeValue) => void;
  disableFuture?: boolean;
}) {
  return (
    <FieldGroup className="gap-4">
      {(
        [
          { key: "from", label: "From" },
          { key: "to", label: "To" },
        ] as const
      ).map(({ key, label }) => (
        <DateTimeInput
          key={key}
          id={`${id}-${key}`}
          label={label}
          value={value[key]}
          error={errors[key]}
          onChange={(newValue) => onChange({ ...value, [key]: newValue })}
          disableFuture={disableFuture}
        />
      ))}
    </FieldGroup>
  );
}
