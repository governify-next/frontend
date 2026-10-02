import { ItemListSkeleton } from "@/components/item/item-list-skeleton";
import { PageShell } from "@/components/page-shell";
import { BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrganizationsLoading() {
  return (
    <PageShell
      breadcrumb={
        <BreadcrumbItem>
          <BreadcrumbPage>Organizations</BreadcrumbPage>
        </BreadcrumbItem>
      }
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <Skeleton className="h-9 w-full lg:w-100" />
        <ItemListSkeleton />
      </div>
    </PageShell>
  );
}
