"use client";

import { ReactNode, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { SystemRole, UserStatus } from "@/types/user.types";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FilterDropdown } from "@/components/filter/filter-dropdown";
import { useQueryStates } from "nuqs";
import {
  AppliedUserFilters,
  USER_FIELDS,
  UserField,
  userSearchParams,
} from "./users-search-params";
import { FilterSummary } from "@/components/filter/filter-summary";

export function UsersFilters({
  totalItems,
  applied,
  action,
}: {
  totalItems?: number;
  applied: AppliedUserFilters;
  action?: ReactNode;
}) {
  const [{ q, field, systemRole, status }, setParams] = useQueryStates(
    userSearchParams,
    { shallow: false },
  );

  const [draft, setDraft] = useState(q);

  const submitSearch = () => setParams({ q: draft || null, page: 1 });

  const clearFilters = () => {
    setDraft("");
    setParams({
      q: null,
      field: "both",
      status: null,
      systemRole: null,
      page: 1,
    });
  };

  const getMaxLength = (field: UserField) => {
    if (field === USER_FIELDS[1]) return 50;
    return 100;
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch();
        }}
        className="flex flex-col gap-2 lg:flex-row lg:items-center"
      >
        <ButtonGroup className="w-full min-w-0 lg:w-100">
          <InputGroup>
            <InputGroupInput
              placeholder="Search users..."
              value={draft}
              onChange={(e) =>
                setDraft(e.target.value.slice(0, getMaxLength(field)))
              }
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="submit"
                size="icon-xs"
                aria-label="Search"
              >
                <IconSearch />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </ButtonGroup>

        <div className="flex items-center justify-between gap-2 lg:flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <FilterDropdown
              label="Type"
              value={field}
              options={[
                { value: USER_FIELDS[0], label: "Username & Email" },
                { value: USER_FIELDS[1], label: "Username" },
                { value: USER_FIELDS[2], label: "Email" },
              ]}
              onSelect={(value) => {
                const nextField = value as UserField;
                setDraft(draft.slice(0, getMaxLength(nextField)));
                setParams({
                  q: q ? q.slice(0, getMaxLength(nextField)) : null,
                  field: nextField,
                  page: 1,
                });
              }}
            />
            <FilterDropdown
              label="System Role"
              clearable
              value={systemRole}
              options={Object.values(SystemRole).map((value) => ({
                value,
                label: value,
              }))}
              onSelect={(value) =>
                setParams({ systemRole: value as SystemRole, page: 1 })
              }
            />
            <FilterDropdown
              label="Status"
              clearable
              value={status}
              options={Object.values(UserStatus).map((value) => ({
                value,
                label: value,
              }))}
              onSelect={(value) =>
                setParams({ status: value as UserStatus, page: 1 })
              }
            />
          </div>

          {action}
        </div>
      </form>

      <FilterSummary
        totalItems={totalItems}
        items={[
          applied.q && {
            label: "matching",
            value: applied.q,
            at: applied.field,
          },
          applied.status && { label: "status", value: applied.status },
          applied.systemRole && { label: "role", value: applied.systemRole },
        ]}
        onClear={clearFilters}
      />
    </div>
  );
}
