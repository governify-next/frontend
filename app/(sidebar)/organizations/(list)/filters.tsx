"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { IconSearch } from "@tabler/icons-react";
import { debounce, useQueryStates } from "nuqs";
import {
  ORGANIZATION_FIELDS,
  OrganizationField,
  organizationSearchParams,
} from "./search-params";

export function OrganizationFilters() {
  const [{ q, field }, setParams] = useQueryStates(organizationSearchParams, {
    shallow: false,
  });

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <InputGroup className="min-w-0 sm:max-w-sm">
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search organizations"
          maxLength={100}
          value={q}
          onChange={(e) =>
            setParams(
              { q: e.target.value || null, page: 1 },
              {
                limitUrlUpdates: e.target.value ? debounce(300) : undefined,
              },
            )
          }
        />
      </InputGroup>

      <ToggleGroup
        type="single"
        value={field}
        onValueChange={(value) => {
          if (!value) return;
          setParams({ field: value as OrganizationField, page: 1 });
        }}
      >
        <ToggleGroupItem value={ORGANIZATION_FIELDS[0]}>Name</ToggleGroupItem>
        <ToggleGroupItem value={ORGANIZATION_FIELDS[1]}>
          Display name
        </ToggleGroupItem>
        <ToggleGroupItem value={ORGANIZATION_FIELDS[2]}>Both</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
