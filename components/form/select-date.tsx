import { DatePickerTime } from "../ui/date-picker";
import { useFieldContext } from "./context";
import { Field, FieldError } from "@/components/ui/field";

export const DatePickerField = ({ label }: { label: string }) => {
  const field = useFieldContext<Date | null>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field data-invalid={isInvalid}>
      <DatePickerTime
        label={label}
        id={field.name}
        value={field.state.value}
        onChange={field.handleChange}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};
