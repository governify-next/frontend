import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersLoading() {
  return (
    <>
      <Skeleton className="h-9 w-full lg:max-w-sm" />
      <DataTableSkeleton columns={6} />
    </>
  );
}
