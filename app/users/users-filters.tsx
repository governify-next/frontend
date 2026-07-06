"use client";

import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { SystemRole, UserStatus } from "@/types/user.types";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FilterDropdown } from "@/components/filter-dropdown";
import { useQueryStates } from "nuqs";
import {
  USER_FIELDS,
  UserField,
  userSearchParams,
} from "./users-search-params";
import { FilterSummary } from "@/components/filter-summary";

export function UsersFilters({ totalItems }: { totalItems?: number }) {
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

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch();
        }}
        className="flex items-center gap-2"
      >
        <ButtonGroup className="w-100 min-w-0">
          <InputGroup>
            <InputGroupInput
              placeholder="Search users..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
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

        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown
            label="Type"
            value={field}
            options={[
              { value: USER_FIELDS[0], label: "Username & Email" },
              { value: USER_FIELDS[1], label: "Username" },
              { value: USER_FIELDS[2], label: "Email" },
            ]}
            onSelect={(value) =>
              setParams({ field: value as UserField, page: 1 })
            }
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
      </form>

      <FilterSummary
        totalItems={totalItems}
        items={[
          q && { label: "matching", value: q, at: field },
          status && { label: "status", value: status },
          systemRole && { label: "role", value: systemRole },
        ]}
        onClear={clearFilters}
      />
    </div>
  );
}
