import { PageShell } from "@/components/page-shell";
import {
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SystemRole } from "@/types/user.types";
import { getCurrentUser } from "@/lib/auth/session";
import { searchOrganizations } from "@/data/organizations/fetch";
import { OrganizationsList } from "./list";
import { OrganizationsAdminActions } from "./admin-actions";
import { ErrorPage } from "@/components/errors";
import { OrganizationFilters } from "./filters";
import { IOrganizationSearchFilters } from "@/types/organization";
import { SearchParams } from "nuqs/server";
import { loadOrganizationSearchParamas } from "./search-params";

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const userResult = await getCurrentUser();
  if (!userResult.ok) {
    return (
      <ErrorPage
        result={userResult}
        message="Something went wrong while fetching current user."
      />
    );
  }
  const { page, limit, q, field } =
    await loadOrganizationSearchParamas(searchParams);
  const filters: IOrganizationSearchFilters = {};

  if (q) {
    if (field === "name") filters.name = q;
    else if (field === "displayName") filters.displayName = q;
    else if (field === "and") {
      filters.name = q;
      filters.displayName = q;
    } else {
      filters.nameOrDisplayName = q;
    }
  }

  const user = userResult.data;
  const isAdmin =
    user!.systemRole === SystemRole.ADMIN ||
    user!.systemRole === SystemRole.SUPERADMIN;
  const result = await searchOrganizations(page, limit, filters);
  if (!result.ok) {
    return (
      <ErrorPage
        result={result}
        message="Something went wrong while fetching organizations."
      />
    );
  }
  const organizations = result.data;
  const pagination = result.pagination!;

  return (
    <PageShell
      breadcrumb={
        <BreadcrumbItem>
          <BreadcrumbPage>Organizations</BreadcrumbPage>
        </BreadcrumbItem>
      }
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <OrganizationFilters
            totalItems={pagination.totalItems}
            applied={{ q, field }}
          />
          {isAdmin && <OrganizationsAdminActions />}
        </div>
        <OrganizationsList
          organizations={organizations}
          pagination={pagination}
        />
      </div>
    </PageShell>
  );
}
