"use client";

import * as React from "react";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerTime({
  label,
  id,
  value,
  onChange,
}: {
  label: string;
  id: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const handleSelectDay = (day: Date | undefined) => {
    if (!day) {
      return onChange(null);
    }
    const selectedDay = new Date(day);
    if (value) {
      selectedDay.setHours(
        value.getHours(),
        value.getMinutes(),
        value.getSeconds(),
      );
    } else {
      selectedDay.setHours(0, 0, 0, 0);
    }
    onChange(selectedDay);
    setOpen(false);
  };

  const handleChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const [h, m, s = 0] = e.target.value.split(":").map(Number);
    const day = value ? new Date(value) : new Date();
    day.setHours(h, m, s, 0);
    onChange(day);
  };

  return (
    <FieldGroup className="flex-row">
      <Field>
        <FieldLabel htmlFor={`${id}-date`} className="w-fit!">
          {label}
        </FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={`${id}-date`}
              className="w-32 justify-between font-normal"
            >
              {value ? format(value, "PPP") : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={value ?? undefined}
              captionLayout="dropdown"
              defaultMonth={value ?? undefined}
              onSelect={handleSelectDay}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <Field className="w-32">
        <FieldLabel htmlFor={`${id}-time`} className="w-fit!">
          Time
        </FieldLabel>
        <Input
          type="time"
          id={`${id}-time`}
          step="1"
          value={value ? format(value, "HH:mm:ss") : ""}
          onChange={handleChangeTime}
          className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  );
}
