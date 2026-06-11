"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IconCheck,
  IconChevronDown,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { SystemRole, UserStatus } from "@/types/user.types";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type QueryField = "both" | "username" | "email" | null;

export function UsersFilters({ totalItems }: { totalItems?: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [field, setField] = useState<QueryField>(
    (searchParams.get("field") as QueryField) ?? "both",
  );

  const setParams = (values: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(values)) {
      value ? params.set(key, value) : params.delete(key);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const submitSearch = () =>
    setParams({ q: query || null, field: query ? field : null });

  const onFieldChange = (next: QueryField) => {
    setField(next);
    if (searchParams.get("q")) setParams({ field: next });
  };

  const clearFilters = () => {
    setQuery("");
    setField("both");
    setParams({ q: null, field: null, status: null, systemRole: null });
  };

  const appliedQuery = searchParams.get("q");
  const appliedField = searchParams.get("field");
  const appliedStatus = searchParams.get("status");
  const appliedRole = searchParams.get("systemRole");

  const bold = "font-semibold text-foreground";
  const summaryParts = [
    appliedQuery && (
      <>
        matching <span className={bold}>{appliedQuery}</span> at{" "}
        <span className={bold}>{appliedField}</span>
      </>
    ),
    appliedStatus && (
      <>
        status <span className={bold}>{appliedStatus}</span>
      </>
    ),
    appliedRole && (
      <>
        role <span className={bold}>{appliedRole}</span>
      </>
    ),
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch();
        }}
        className="flex flex-wrap items-center gap-2"
      >
        <ButtonGroup>
          <InputGroup>
            <InputGroupInput
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
              { value: "both", label: "Username & Email" },
              { value: "username", label: "Username" },
              { value: "email", label: "Email" },
            ]}
            onSelect={(value) => onFieldChange(value as QueryField)}
          />
          <FilterDropdown
            label="System Role"
            clearable
            value={searchParams.get("systemRole")}
            options={Object.values(SystemRole).map((value) => ({
              value,
              label: value,
            }))}
            onSelect={(value) => setParams({ systemRole: value })}
          />
          <FilterDropdown
            label="Status"
            clearable
            value={searchParams.get("status")}
            options={Object.values(UserStatus).map((value) => ({
              value,
              label: value,
            }))}
            onSelect={(value) => setParams({ status: value })}
          />
        </div>
      </form>

      {summaryParts.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {totalItems ?? 0} {totalItems === 1 ? "result" : "results"}{" "}
            {summaryParts.map((part, i) => (
              <span key={i}>
                {i > 0 && " , "}
                {part}
              </span>
            ))}
          </span>
          <Button variant="secondary" size="sm" onClick={clearFilters}>
            <IconX />
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}

function FilterDropdown({
  label,
  value,
  options,
  onSelect,
  clearable = false,
}: {
  label: string;
  value: string | null;
  options: { value: string; label: string }[];
  onSelect: (value: string | null) => void;
  clearable?: boolean;
}) {
  const items = clearable
    ? [{ value: null, label: "All" }, ...options]
    : options;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {label}
          <IconChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {items.map((item) => {
          const selected = item.value === value;

          return (
            <DropdownMenuItem
              key={item.value ?? "all"}
              disabled={selected}
              onClick={() => onSelect(item.value)}
            >
              {item.label}
              {selected && <IconCheck className="ml-auto" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
