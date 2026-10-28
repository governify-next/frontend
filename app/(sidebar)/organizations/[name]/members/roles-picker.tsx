"use client";

import { useState, useTransition } from "react";
import { ShieldCheck } from "lucide-react";
import { IMembership, IRole } from "@/types/organization";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

    if (
      selectedRoles.length === memberRoles.length &&
      selectedRoles.every((name) => memberRoles.includes(name))
    ) {
      return;
    }

    startTransition(async () => {
      if (!(await onRolesChange(selectedRoles))) {
        setSelectedRoles(memberRoles);
      }
    });
  };

  const toggleRole = (name: string) =>
    setSelectedRoles(
      selectedRoles.includes(name)
        ? selectedRoles.filter((selected) => selected !== name)
        : [...selectedRoles, name],
    );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="warning"
          size="icon-sm"
          aria-label={`Change roles of ${member.userId.username}`}
          disabled={isPending}
        >
          {isPending ? <Spinner /> : <ShieldCheck />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-0">
        <Command>
          <CommandInput placeholder="Search roles..." />
          <CommandList>
            <CommandEmpty>No roles found.</CommandEmpty>
            <CommandGroup>
              {roles.map((role) => (
                <CommandItem
                  key={role._id}
                  value={role.name}
                  disabled={
                    organizationCreatorId === member.userId._id &&
                    role.name === "admin"
                  }
                  aria-checked={selectedRoles.includes(role.name)}
                  onSelect={() => toggleRole(role.name)}
                >
                  <Checkbox
                    checked={selectedRoles.includes(role.name)}
                    aria-hidden
                    tabIndex={-1}
                    className="pointer-events-none"
                  />
                  <span
                    aria-hidden
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: role.color }}
                  />
                  <span className="truncate">{role.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
