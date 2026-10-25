"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DataTablePagination } from "./data-table-pagination";
import { Pagination } from "@/types/pagination";
import { usePaginationParams } from "@/hooks/use-pagination-params";

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  itemLabel,
  empty = { title: "No results" },
}: {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
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
    columns,
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
    <div className="flex flex-col gap-4">
      {rows.length ? (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Empty className="border">
          <EmptyHeader>
            {empty.icon && <EmptyMedia variant="icon">{empty.icon}</EmptyMedia>}
            <EmptyTitle>{empty.title}</EmptyTitle>
            {empty.description && (
              <EmptyDescription>{empty.description}</EmptyDescription>
            )}
          </EmptyHeader>
        </Empty>
      )}
      {table.getRowCount() > 0 && (
        <DataTablePagination table={table} itemLabel={itemLabel} />
      )}
    </div>
  );
}
