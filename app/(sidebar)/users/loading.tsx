import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersLoading() {
  return (
    <PageShell
      breadcrumb={
        <BreadcrumbItem>
          <BreadcrumbPage>Users</BreadcrumbPage>
        </BreadcrumbItem>
      }
    >
      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-full lg:w-100" />
        <DataTableSkeleton />
      </div>
    </PageShell>
  );
}
