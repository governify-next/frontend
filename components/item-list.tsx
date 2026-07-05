"use client";
import { Fragment } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";
import { ItemGroup } from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "./data-table-pagination";
import { Pagination } from "@/types/pagination";
import { usePaginationParams } from "@/hooks/use-pagination-params";

// Use this component when you need to render a list of items with pagination.
export function ItemList<T>({
  data,
  renderItem,
  className,
  pagination,
}: {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  className?: string;
  pagination?: Pagination;
}) {
  const isManualPagination = pagination !== undefined;
  const {
    pagination: state,
    pageCount,
    onPaginationChange,
  } = usePaginationParams(pagination);

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    if (!onPaginationChange || !state) return;
    const next = typeof updater === "function" ? updater(state) : updater;
    onPaginationChange(next);
  };

  const table = useReactTable({
    data,
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    ...(isManualPagination
      ? {
          manualPagination: true,
          pageCount,
          state: { pagination: state },
          onPaginationChange: handlePaginationChange,
        }
      : {
          getPaginationRowModel: getPaginationRowModel(),
        }),
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
