import { IconX } from "@tabler/icons-react";
import { Button } from "../ui/button";

type SummaryItem = { label: string; value: string; at?: string };

export function FilterSummary({
  totalItems,
  items,
  onClear,
}: {
  totalItems?: number;
  items: (SummaryItem | false | null | undefined | "")[];
  onClear: () => void;
}) {
  const visible = items.filter(Boolean) as SummaryItem[];
  if (visible.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>
        {totalItems ?? 0} {totalItems === 1 ? "result" : "results"}{" "}
        {visible.map((item, i) => (
          <span key={i}>
            {i > 0 && " , "}
            {item.label}{" "}
            <strong className="font-semibold text-foreground">
              {item.value}
            </strong>
            {item.at && (
              <>
                {" "}
                at{" "}
                <strong className="font-semibold text-foreground">
                  {item.at}
                </strong>
              </>
            )}
          </span>
        ))}
      </span>
      <Button variant="secondary" size="sm" onClick={onClear}>
        <IconX /> Clear filters
      </Button>
    </div>
  );
}
