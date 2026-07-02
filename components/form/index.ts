"use client";

import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-context";
import { TextField } from "./text-field";
import { TextareaField } from "./textarea-field";
import { SelectField } from "./select-field";
import { SubmitButton } from "./submit-button";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
  },
  formComponents: {
    SubmitButton,
  },
});
