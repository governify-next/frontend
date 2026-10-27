import { searchOrganizations } from "@/data/organizations/fetch";
import { OrganizationsList } from "./_components/list";
import { ErrorPage } from "@/components/errors";
import { OrganizationFilters } from "./_components/filters";
import { IOrganizationSearchFilters } from "@/types/organization";
import { SearchParams } from "nuqs/server";
import { loadOrganizationSearchParamas } from "./search-params";

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, limit, q } = await loadOrganizationSearchParamas(searchParams);
  const filters: IOrganizationSearchFilters = {};

  if (q) filters.nameOrDisplayName = q;

  const result = await searchOrganizations(page, limit, filters);
  if (!result.ok) {
    return (
      <ErrorPage
        result={result}
        message="Something went wrong while fetching organizations."
      />
    );
  }

  return (
    <>
      <OrganizationFilters />
      <OrganizationsList
        organizations={result.data}
        pagination={result.pagination!}
        query={q}
      />
    </>
  );
}
