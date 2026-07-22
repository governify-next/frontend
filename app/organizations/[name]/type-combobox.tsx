"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useFieldContext } from "@/components/form/form-context";
import { cn } from "@/lib/utils/cn";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function TypeCombobox({
  label,
  existingTypes,
}: {
  label: string;
  existingTypes: string[];
}) {
  const field = useFieldContext<string>();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const value = field.state.value;
  const trimmed = search.trim();
  const showCreate =
    trimmed !== "" &&
    !existingTypes.some((t) => t.toLowerCase() === trimmed.toLowerCase());

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const select = (type: string) => {
    field.handleChange(type);
    setSearch("");
    setOpen(false);
  };

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) field.handleBlur();
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id={field.name}
            variant="outline"
            role="combobox"
            aria-invalid={isInvalid}
            className="w-full justify-between font-normal"
          >
            <span className="truncate">
              {value || "Select or create a type..."}
            </span>
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width) p-0"
        >
          <Command>
            <CommandInput
              placeholder="Search or create a type..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No types found.</CommandEmpty>
              <CommandGroup>
                {existingTypes.map((type) => (
                  <CommandItem
                    key={type}
                    value={type}
                    onSelect={() => select(type)}
                  >
                    <Check
                      className={cn(value === type ? "opacity-100" : "opacity-0")}
                    />
                    {type}
                  </CommandItem>
                ))}
                {showCreate && (
                  <CommandItem value={trimmed} onSelect={() => select(trimmed)}>
                    <Plus />
                    Create &quot;{trimmed}&quot;
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
