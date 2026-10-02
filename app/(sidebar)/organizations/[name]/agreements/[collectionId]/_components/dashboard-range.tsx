"use client";

import { useQueryStates } from "nuqs";

import { DatePickerTime } from "@/components/ui/date-picker";
import { agreementVersionSearchParams } from "../search-params";

// PoC: global range for the charts. Changing it asks the server for new data.
export function DashboardRange({ range }: { range: { from: Date; to: Date } }) {
  const [, setRange] = useQueryStates(agreementVersionSearchParams, {
    shallow: false,
  });

  return (
    <div className="flex flex-wrap gap-4">
      <DatePickerTime
        id="dashboard-from"
        label="From"
        value={range.from}
        onChange={(from) => from && setRange({ from })}
      />
      <DatePickerTime
        id="dashboard-to"
        label="To"
        value={range.to}
        onChange={(to) => to && setRange({ to })}
      />
    </div>
  );
}
