import { Suspense } from "react";
import { Page } from "@/components/page/page";
import { PageContent } from "@/components/page/page-content";
import { BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth/session";
import { UsersAdminActions } from "./_components/admin-actions";

async function UsersActions() {
  const result = await getCurrentUser();
  return result.ok ? (
    <UsersAdminActions currentUserRole={result.data.systemRole} />
  ) : null;
}

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Page
      breadcrumb={
        <BreadcrumbItem>
          <BreadcrumbPage>Users</BreadcrumbPage>
        </BreadcrumbItem>
      }
    >
      <PageContent
        title="Users"
        description="Manage who has access to the platform, adjusting their details, roles and status."
        actions={
          <Suspense fallback={<Skeleton className="h-9 w-26" />}>
            <UsersActions />
          </Suspense>
        }
      >
        {children}
      </PageContent>
    </Page>
  );
}
