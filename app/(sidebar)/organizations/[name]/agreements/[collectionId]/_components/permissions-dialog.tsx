"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Activity,
  CalendarSync,
  ChevronDown,
  Eye,
  Pencil,
  PlayIcon,
  PowerOff,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { ICollectionPermissions } from "@/types/agreement";
import { IRole } from "@/types/organization";
import { updateCollectionPermissions } from "@/data/agreements/actions";
import { sameItems, toggleItem } from "@/lib/utils/array";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RoleBadge } from "@/components/role/role-badge";
import { RolesPicker } from "@/components/role/roles-picker";

const permissionCatalog: Record<
  keyof ICollectionPermissions,
  { label: string; description: string; icon: React.ReactNode }
> = {
  "collection:view": {
    label: "View agreement",
    description: "View the agreement and go into its details.",
    icon: <Eye />,
  },
  "collection:edit": {
    label: "Edit agreement",
    description: "Change the agreement information.",
    icon: <Pencil />,
  },
  "collection:auto-tracking": {
    label: "Toggle tracking",
    description:
      "Start or stop the automatic tracking of an agreement version.",
    icon: <CalendarSync />,
  },
  "collection:track-period": {
    label: "Track period",
    description: "Collect data from a past period.",
    icon: <PlayIcon />,
  },
  "collection:view-evolutive": {
    label: "View evolutive points",
    description: "Show the evolutive points in the agreement charts.",
    icon: <Activity />,
  },
  "version:terminate": {
    label: "Terminate version",
    description: "End the active version of the agreement.",
    icon: <PowerOff />,
  },
  "collection:delete": {
    label: "Delete collection",
    description: "Remove the collection and all its versions.",
    icon: <Trash2 />,
  },
};

const permissionKeys = Object.keys(
  permissionCatalog,
) as (keyof ICollectionPermissions)[];

export function CollectionPermissionsDialog({
  orgName,
  collectionId,
  roles,
  permissions,
}: {
  orgName: string;
  collectionId: string;
  roles: IRole[];
  permissions: ICollectionPermissions;
}) {
  const router = useRouter();
  const assignableRoles = roles.filter((role) => role.name !== "admin");
  const initial = Object.fromEntries(
    permissionKeys.map((key) => [
      key,
      (permissions[key] ?? []).filter((id) =>
        assignableRoles.some((role) => role._id === id),
      ),
    ]),
  ) as ICollectionPermissions;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(initial);
  const [isSaving, startSaving] = useTransition();

  const isDirty = permissionKeys.some(
    (key) => !sameItems(initial[key], draft[key]),
  );

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(initial);
    setOpen(next);
  };

  const toggleRole = (key: keyof ICollectionPermissions, roleId: string) =>
    setDraft((current) => ({
      ...current,
      [key]: toggleItem(current[key], roleId),
    }));

  const toggleRoleInAll = (roleId: string) =>
    setDraft((current) => {
      const inAll = permissionKeys.every((key) =>
        current[key].includes(roleId),
      );
      return Object.fromEntries(
        permissionKeys.map((key) => [
          key,
          [
            ...current[key].filter((id) => id !== roleId),
            ...(inAll ? [] : [roleId]),
          ],
        ]),
      ) as ICollectionPermissions;
    });

  const handleSave = () =>
    startSaving(async () => {
      const result = await updateCollectionPermissions(
        orgName,
        collectionId,
        draft,
      );

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Permissions updated.");
      setOpen(false);
      router.refresh();
    });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ShieldCheck />
          Manage permissions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Collection permissions</DialogTitle>
          <DialogDescription>
            Choose which roles can perform each action. Organization admins can
            always perform every action.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-col gap-2">
          <Card
            size="sm"
            className="shrink-0 flex-row items-center justify-between gap-4 bg-muted/40 px-3 shadow-none"
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-medium">All permissions</span>
              <span className="text-xs text-muted-foreground">
                Add or remove a role from every action at once.
              </span>
            </div>
            <RolesSelect
              roles={assignableRoles}
              label="Assign roles to all permissions"
              getChecked={(role) => {
                const assigned = permissionKeys.filter((key) =>
                  draft[key].includes(role._id),
                ).length;
                if (assigned === permissionKeys.length) return true;
                return assigned > 0 ? "indeterminate" : false;
              }}
              onToggle={(role) => toggleRoleInAll(role._id)}
            />
          </Card>
          <DialogBody>
            <ItemGroup>
              {permissionKeys.map((key) => {
                const { label, description, icon } = permissionCatalog[key];
                return (
                  <Item
                    key={key}
                    variant="outline"
                    size="sm"
                    className="flex-nowrap"
                  >
                    <ItemMedia className="size-8 rounded-md bg-muted text-muted-foreground group-has-data-[slot=item-description]/item:translate-y-0 group-has-data-[slot=item-description]/item:self-center [&_svg]:size-4">
                      {icon}
                    </ItemMedia>
                    <ItemContent className="min-w-0 gap-0.5">
                      <ItemTitle title={label}>{label}</ItemTitle>
                      <ItemDescription
                        className="break-words text-xs"
                        title={description}
                      >
                        {description}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <RolesSelect
                        roles={assignableRoles}
                        label={`Roles allowed to ${label.toLowerCase()}`}
                        getChecked={(role) => draft[key].includes(role._id)}
                        onToggle={(role) => toggleRole(key, role._id)}
                      />
                    </ItemActions>
                  </Item>
                );
              })}
            </ItemGroup>
          </DialogBody>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSaving}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={!isDirty || isSaving}>
            {isSaving && <Spinner />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RolesSelect({
  label,
  roles,
  getChecked,
  ...pickerProps
}: Omit<React.ComponentProps<typeof RolesPicker>, "children"> & {
  label: string;
}) {
  const selected = roles.filter((role) => getChecked(role) === true);

  return (
    <RolesPicker roles={roles} getChecked={getChecked} {...pickerProps}>
      <Button
        variant="outline"
        size="sm"
        aria-label={label}
        className="w-40 shrink-0 justify-between font-normal sm:w-56"
      >
        {selected.length === 0 ? (
          <span className="text-muted-foreground">No roles</span>
        ) : (
          <span className="flex min-w-0 items-center gap-1">
            {selected.slice(0, 2).map((role, index) => (
              <RoleBadge
                key={role._id}
                role={role}
                className={cn("shrink", index > 0 && "hidden sm:inline-flex")}
              />
            ))}
            {selected.length > 1 && (
              <Badge variant="muted" className="sm:hidden">
                +{selected.length - 1}
              </Badge>
            )}
            {selected.length > 2 && (
              <Badge variant="muted" className="hidden sm:inline-flex">
                +{selected.length - 2}
              </Badge>
            )}
          </span>
        )}
        <ChevronDown className="text-muted-foreground" />
      </Button>
    </RolesPicker>
  );
}
