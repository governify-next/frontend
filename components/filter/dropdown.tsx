import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import type { Option } from "@/types/option";

export function FilterDropdown<T extends string>({
  allLabel,
  value,
  options,
  onSelect,
  contentClassName,
}: {
  allLabel: string;
  value: T | null;
  options: Option<T>[];
  onSelect: (value: T | null) => void;
  contentClassName?: string;
}) {
  const items = [{ value: null, label: allLabel }, ...options];
  const current = items.find((item) => item.value === value) ?? items[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {current.label}
          <IconChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={contentClassName}>
        {items.map((item) => {
          const selected = item === current;

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
