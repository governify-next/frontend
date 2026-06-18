"use client";
import { Fragment } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { ItemGroup } from "@/components/ui/item";
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
      <ItemGroup>
        {rows.length ? (
          rows.map((row) => (
            <Fragment key={row.id}>{renderItem(row.original as T)}</Fragment>
          ))
        ) : (
          <div className="flex h-24 items-center justify-center rounded-md border text-sm text-muted-foreground">
            No results.
          </div>
        )}
      </ItemGroup>
      <DataTablePagination table={table} />
    </div>
  );
}
