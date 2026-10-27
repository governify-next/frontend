"use client";

import { IconSearch } from "@tabler/icons-react";
import { debounce, parseAsString, useQueryStates } from "nuqs";
import { cn } from "cn";
import { paginationSearchParams } from "@/lib/search/pagination";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

export function SearchFilter({
  placeholder,
  maxLength,
  className,
}: {
  placeholder: string;
  maxLength: number;
  className?: string;
}) {
  const [{ q }, setParams] = useQueryStates(
    { q: parseAsString.withDefault(""), page: paginationSearchParams.page },
    { shallow: false },
  );

  return (
    <InputGroup className={cn("min-w-0", className)}>
      <InputGroupAddon>
        <IconSearch />
      </InputGroupAddon>
      <InputGroupInput
        placeholder={placeholder}
        maxLength={maxLength}
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
  );
}
