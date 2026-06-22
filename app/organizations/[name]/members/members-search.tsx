"use client";

import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { useQueryParams } from "@/hooks/use-query-params";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export function MembersSearch() {
  const { searchParams, setParams } = useQueryParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setParams({ q: query || null });
      }}
      className="flex-1"
    >
      <InputGroup>
        <InputGroupInput
          placeholder="Search members..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton type="submit" size="icon-xs" aria-label="Search">
            <IconSearch />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
