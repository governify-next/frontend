"use client";
import { Fragment } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { ItemGroup, ItemSeparator } from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "./data-table-pagination";

export function ItemList<T>({
  data,
  renderItem,
  className,
}: {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  className?: string;
}) {
  const table = useReactTable({
    data,
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  const rows = table.getRowModel().rows;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <ItemGroup className="rounded-md border">
        {rows.length ? (
          rows.map((row, i) => (
            <Fragment key={row.id}>
              {renderItem(row.original as T)}
              {i !== rows.length - 1 && <ItemSeparator />}
            </Fragment>
          ))
        ) : (
          <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
            No results.
          </div>
        )}
      </ItemGroup>
      <DataTablePagination table={table} />
    </div>
  );
}
