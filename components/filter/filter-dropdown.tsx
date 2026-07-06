import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { DropdownMenu } from "../ui/dropdown-menu";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";

export function FilterDropdown({
  label,
  value,
  options,
  onSelect,
  clearable = false,
  contentClassName,
}: {
  label: string;
  value: string | null;
  options: { value: string; label: string }[];
  onSelect: (value: string | null) => void;
  clearable?: boolean;
  contentClassName?: string;
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
      <DropdownMenuContent align="start" className={contentClassName}>
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
