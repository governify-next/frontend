import { Suspense } from "react";
import { ListPage } from "@/components/page/list-page";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth/session";
import { SystemRole } from "@/types/user.types";
import { OrganizationsAdminActions } from "./_components/admin-actions";

async function OrganizationsActions() {
  const result = await getCurrentUser();
  const isAdmin =
    result.ok &&
    (result.data.systemRole === SystemRole.ADMIN ||
      result.data.systemRole === SystemRole.SUPERADMIN);
  return isAdmin ? <OrganizationsAdminActions /> : null;
}

export default function OrganizationsListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ListPage
      title="Organizations"
      description="Browse organizations and choose one to see its details."
      actions={
        <Suspense fallback={<Skeleton className="h-9 w-38" />}>
          <OrganizationsActions />
        </Suspense>
      }
    >
      {children}
    </ListPage>
  );
}
