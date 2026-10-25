"use client";

import { SystemRole, UserStatus } from "@/types/user.types";
import { FilterDropdown } from "@/components/filter/dropdown";
import { SearchFilter } from "@/components/filter/search";
import { useQueryStates } from "nuqs";
import { userSearchParams } from "../search-params";
import { enumOptions } from "@/lib/utils/formatter";

export function UsersFilters() {
  const [{ systemRole, status }, setParams] = useQueryStates(userSearchParams, {
    shallow: false,
  });

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      <SearchFilter
        placeholder="Search users"
        maxLength={100}
        className="lg:max-w-sm"
      />

      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          allLabel="All roles"
          contentClassName="w-40"
          value={systemRole}
          options={enumOptions(SystemRole)}
          onSelect={(systemRole) => setParams({ systemRole, page: 1 })}
        />
        <FilterDropdown
          allLabel="All statuses"
          contentClassName="w-40"
          value={status}
          options={enumOptions(UserStatus)}
          onSelect={(status) => setParams({ status, page: 1 })}
        />
      </div>
    </div>
  );
}
