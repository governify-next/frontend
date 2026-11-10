"use client";

import { useState, useTransition } from "react";
import { ShieldCheck } from "lucide-react";
import { IMembership, IRole } from "@/types/organization";
import { sameItems, toggleItem } from "@/lib/utils/array";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { RolesPicker } from "@/components/role/roles-picker";

export function MemberRolesPicker({
  member,
  roles,
  organizationCreatorId,
  onRolesChange,
}: {
  member: IMembership;
  roles: IRole[];
  organizationCreatorId: string;
  onRolesChange: (rolesNames: string[]) => Promise<boolean>;
}) {
  const memberRoles = member.roles.map((role) => role.name);
  const [open, setOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState(memberRoles);
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = (next: boolean) => {
    setOpen(next);

    if (next) {
      setSelectedRoles(memberRoles);
      return;
    }

    if (sameItems(selectedRoles, memberRoles)) return;

    startTransition(async () => {
      if (!(await onRolesChange(selectedRoles))) {
        setSelectedRoles(memberRoles);
      }
    });
  };

  return (
    <RolesPicker
      roles={roles}
      open={open}
      onOpenChange={handleOpenChange}
      getChecked={(role) => selectedRoles.includes(role.name)}
      onToggle={(role) =>
        setSelectedRoles(toggleItem(selectedRoles, role.name))
      }
      isDisabled={(role) =>
        organizationCreatorId === member.userId._id && role.name === "admin"
      }
    >
      <Button
        variant="warning"
        size="icon-sm"
        aria-label={`Change roles of ${member.userId.username}`}
        disabled={isPending}
      >
        {isPending ? <Spinner /> : <ShieldCheck />}
      </Button>
    </RolesPicker>
  );
}
