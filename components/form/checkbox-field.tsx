import { Checkbox } from "../ui/checkbox";
import { useFieldContext } from "./context";
import { Field, FieldLabel } from "@/components/ui/field";

export const CheckboxField = ({ label }: { label: string }) => {
  const field = useFieldContext<boolean>();
  return (
    <Field orientation="horizontal">
      <Checkbox
        id={field.name}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked === true)}
      />
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
    </Field>
  );
};
