"use client";

import { useState } from "react";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { IconSearch } from "@tabler/icons-react";
import { FilterDropdown } from "@/components/filter-dropdown";
import { useQueryStates } from "nuqs";
import {
  ORGANIZATION_FIELDS,
  OrganizationField,
  organizationSearchParams,
} from "./organization-search-params";
import { FilterSummary } from "@/components/filter-summary";

export function OrganizationFilters({ totalItems }: { totalItems?: number }) {
  const [{ q, field }, setParams] = useQueryStates(organizationSearchParams, {
    shallow: false,
  });
  const [draft, setDraft] = useState(q);

  const submitSearch = () => setParams({ q: draft || null, page: 1 });

  const clearFilters = () => {
    setDraft("");
    setParams({ q: null, field: "both", page: 1 });
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
              placeholder="Search organizations..."
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
              { value: ORGANIZATION_FIELDS[2], label: "Name or Display Name" },
              { value: ORGANIZATION_FIELDS[3], label: "Name and Display Name" },
              { value: ORGANIZATION_FIELDS[0], label: "Name" },
              { value: ORGANIZATION_FIELDS[1], label: "Display Name" },
            ]}
            onSelect={(value) => {
              setParams({ field: value as OrganizationField, page: 1 });
            }}
          />
        </div>
      </form>
      <FilterSummary
        totalItems={totalItems}
        items={[q && { label: "matching", value: q, at: field }]}
        onClear={clearFilters}
      />
    </div>
  );
}
