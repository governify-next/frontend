"use client";

import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export function OrganizationsAdminActions() {
  return (
    <Button
      onClick={() => {
        // TODO: abrir la creación de organización cuando exista el endpoint/dialog.
      }}
    >
      <IconPlus />
      Add organization
    </Button>
  );
}
