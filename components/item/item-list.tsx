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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils/cn";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Pagination } from "@/types/pagination";
import { usePaginationParams } from "@/hooks/use-pagination-params";

// Use this component when you need to render a list of items with pagination.
export function ItemList<T>({
  data,
  renderItem,
  className,
  pagination,
  itemLabel,
  empty = { title: "No results" },
}: {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  className?: string;
  pagination?: Pagination;
  itemLabel?: string;
  empty?: { icon?: React.ReactNode; title: string; description?: string };
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
          rowCount: pagination.totalItems,
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
          <Empty className="border">
            <EmptyHeader>
              {empty.icon && (
                <EmptyMedia variant="icon">{empty.icon}</EmptyMedia>
              )}
              <EmptyTitle>{empty.title}</EmptyTitle>
              {empty.description && (
                <EmptyDescription>{empty.description}</EmptyDescription>
              )}
            </EmptyHeader>
          </Empty>
        )}
      </ItemGroup>
      {table.getRowCount() > 0 && (
        <DataTablePagination table={table} itemLabel={itemLabel} />
      )}
    </div>
  );
}
