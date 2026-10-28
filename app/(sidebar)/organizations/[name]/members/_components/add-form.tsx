import { AtSign } from "lucide-react";
import { useAppForm } from "@/components/form";
import { IMembershipPayload } from "@/types/organization";
import { membershipFormSchema } from "@/schemas/organization";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function AddMemberDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (payload: IMembershipPayload) => Promise<boolean>;
}) {
  const form = useAppForm({
    defaultValues: {
      username: "",
    },
    validators: {
      onSubmit: membershipFormSchema,
    },
    onSubmit: async ({ value }) => {
      const success = await onCreate(value);
      if (success) {
        form.reset();
        onOpenChange(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add member</DialogTitle>
          <DialogDescription>
            Enter the username of the user you want to add to this organization.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form
            id="add-member-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup className="gap-5">
              <form.AppField name="username">
                {(field) => (
                  <field.TextField
                    label="Username"
                    icon={<AtSign />}
                    placeholder="johndoe"
                    autoFocus
                  />
                )}
              </form.AppField>
            </FieldGroup>
          </form>
        </DialogBody>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => form.reset()}>
              Cancel
            </Button>
          </DialogClose>
          <form.AppForm>
            <form.SubmitButton label="Add member" formId="add-member-form" />
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
