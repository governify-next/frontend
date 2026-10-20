"use client";

import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./context";
import { TextField } from "./text-field";
import { TextareaField } from "./textarea-field";
import { SelectField } from "./select-field";
import { SubmitButton } from "./submit-button";
import { CheckboxField } from "./checkbox-field";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
    CheckboxField,
  },
  formComponents: {
    SubmitButton,
  },
});
