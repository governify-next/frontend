"use client";

import { useState, type ComponentProps } from "react";
import { IconEye, IconEyeOff, IconRefresh } from "@tabler/icons-react";
import { useFieldContext } from "./context";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { generatePassword } from "@/lib/utils/password";

export function PasswordField({
  label,
  description,
  ...inputProps
}: { label: string; description?: string } & ComponentProps<
  typeof InputGroupInput
>) {
  const field = useFieldContext<string>();
  const [visible, setVisible] = useState(false);
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        <Button
          type="button"
          variant="link"
          size="xs"
          className="h-auto p-0"
          onClick={() => {
            field.handleChange(generatePassword());
            setVisible(true);
          }}
        >
          <IconRefresh />
          Generate
        </Button>
      </div>
      <InputGroup>
        <InputGroupInput
          {...inputProps}
          id={field.name}
          name={field.name}
          type={visible ? "text" : "password"}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          autoComplete="new-password"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <IconEye /> : <IconEyeOff />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {isInvalid ? (
        <FieldError errors={field.state.meta.errors} />
      ) : (
        description && <FieldDescription>{description}</FieldDescription>
      )}
    </Field>
  );
}
