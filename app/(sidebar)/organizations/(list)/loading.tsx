import { ItemListSkeleton } from "@/components/item/item-list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrganizationsLoading() {
  return (
    <>
      <Skeleton className="h-9 w-full sm:max-w-sm" />
      <ItemListSkeleton />
    </>
  );
}
