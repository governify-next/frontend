"use client";

import { useState } from "react";
import { format, isValid, min, parse, set } from "date-fns";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EXPAND_DATE_TIME_FORMAT } from "@/lib/utils/formatter";

export function DateTimeInput({
  id,
  label,
  value,
  error,
  onChange,
  disableFuture = false,
}: {
  id: string;
  label: string;
  value: string;
  error: string | null;
  onChange: (value: string) => void;
  disableFuture?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const date = parse(value, EXPAND_DATE_TIME_FORMAT, new Date());
  const selected = isValid(date) ? date : undefined;
  const today = new Date();

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <ButtonGroup className="w-full">
            <Input
              id={id}
              value={value}
              aria-invalid={!!error}
              className="aria-invalid:relative aria-invalid:z-10"
              onChange={(e) => onChange(e.target.value)}
            />
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label={`Open calendar for ${label}`}
              >
                <CalendarDays />
              </Button>
            </PopoverTrigger>
          </ButtonGroup>
        </PopoverAnchor>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            required
            selected={selected}
            defaultMonth={selected}
            disabled={disableFuture ? { after: today } : undefined}
            endMonth={disableFuture ? today : undefined}
            onSelect={(day) => {
              const next = selected
                ? set(selected, {
                    year: day.getFullYear(),
                    month: day.getMonth(),
                    date: day.getDate(),
                  })
                : day;
              onChange(
                format(
                  disableFuture ? min([next, new Date()]) : next,
                  EXPAND_DATE_TIME_FORMAT,
                ),
              );
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
