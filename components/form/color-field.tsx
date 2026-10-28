"use client";

import { useRef, useState } from "react";
import { IconCheck, IconRefresh } from "@tabler/icons-react";
import { useFieldContext } from "./context";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { HEX_COLOR, randomColor } from "@/lib/utils/color";

export function ColorField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const [paletteOpen, setPaletteOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const lastHue = useRef<number | null>(null);

  const generateColor = () => {
    lastHue.current =
      ((lastHue.current ?? Math.random() * 360) + 40 + Math.random() * 280) %
      360;
    field.handleChange(randomColor(lastHue.current));
  };

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Popover open={paletteOpen} onOpenChange={setPaletteOpen}>
        <PopoverAnchor asChild>
          <InputGroup ref={anchorRef}>
            <InputGroupAddon>
              <span
                aria-hidden
                className="size-4 rounded-sm border border-foreground/10"
                style={{
                  backgroundColor: HEX_COLOR.test(field.state.value)
                    ? field.state.value
                    : "transparent",
                }}
              />
            </InputGroupAddon>
            <InputGroupInput
              id={field.name}
              name={field.name}
              value={field.state.value}
              onFocus={() => setPaletteOpen(true)}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value.toLowerCase())}
              aria-invalid={isInvalid}
              autoComplete="off"
              spellCheck={false}
              maxLength={7}
              placeholder="#0ea5e9"
              className="font-mono"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label="Generate random color"
                onClick={generateColor}
              >
                <IconRefresh />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </PopoverAnchor>
        <PopoverContent
          align="start"
          className="w-auto p-2"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            if (anchorRef.current?.contains(e.target as Node)) {
              e.preventDefault();
            }
          }}
        >
          <div className="grid grid-cols-8 gap-1.5">
            {[
              { name: "Rose", hex: "#f43f5e" },
              { name: "Orange", hex: "#f97316" },
              { name: "Amber", hex: "#f59e0b" },
              { name: "Emerald", hex: "#10b981" },
              { name: "Sky", hex: "#0ea5e9" },
              { name: "Violet", hex: "#8b5cf6" },
              { name: "Fuchsia", hex: "#d946ef" },
              { name: "Gray", hex: "#6b7280" },
            ].map(({ name, hex }) => (
              <button
                key={hex}
                type="button"
                aria-label={name}
                aria-pressed={field.state.value === hex}
                title={name}
                className="flex size-6 items-center justify-center rounded-sm text-white outline-none hover:scale-110 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                style={{ backgroundColor: hex }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => field.handleChange(hex)}
              >
                {field.state.value === hex && (
                  <IconCheck className="size-3.5" />
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
