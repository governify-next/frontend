import { getScopes } from "@/data/scopes/fetch";
import { ErrorPage } from "@/components/errors";
import { ScopesExplorer } from "./scopes-explorer";

export default async function OrganizationHomePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const orgName = decodeURIComponent(name);

  const result = await getScopes(orgName);
  if (!result.ok) {
    return (
      <ErrorPage
        result={result}
        message="Something went wrong while fetching scopes."
      />
    );
  }

  return <ScopesExplorer orgName={orgName} tree={result.data} />;
}
