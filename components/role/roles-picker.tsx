"use client";

import { IRole } from "@/types/organization";
import { Checkbox } from "@/components/ui/checkbox";
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

export function RolesPicker({
  roles,
  getChecked,
  onToggle,
  isDisabled,
  open,
  onOpenChange,
  children,
}: {
  roles: IRole[];
  getChecked: (role: IRole) => boolean | "indeterminate";
  onToggle: (role: IRole) => void;
  isDisabled?: (role: IRole) => boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-0">
        <Command>
          <CommandInput placeholder="Search roles..." />
          <CommandList className="[scrollbar-width:thin]!">
            <CommandEmpty>No roles found.</CommandEmpty>
            <CommandGroup>
              {roles.map((role) => {
                const checked = getChecked(role);
                return (
                  <CommandItem
                    key={role._id}
                    value={role.name}
                    disabled={isDisabled?.(role)}
                    aria-checked={
                      checked === "indeterminate" ? "mixed" : checked
                    }
                    onSelect={() => onToggle(role)}
                  >
                    <Checkbox
                      checked={checked}
                      aria-hidden
                      tabIndex={-1}
                      className="pointer-events-none data-[state=indeterminate]:opacity-50 [&_svg]:text-primary-foreground!"
                    />
                    <span
                      aria-hidden
                      className="size-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: role.color }}
                    />
                    <span className="truncate capitalize">{role.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
