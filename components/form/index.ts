"use client";

import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./context";
import { TextField } from "./text-field";
import { TextareaField } from "./textarea-field";
import { SelectField } from "./select-field";
import { SubmitButton } from "./submit-button";
import { CheckboxField } from "./checkbox-field";
import { DatePickerField } from "./select-date";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
    DatePickerField,
    CheckboxField,
  },
  formComponents: {
    SubmitButton,
  },
});
