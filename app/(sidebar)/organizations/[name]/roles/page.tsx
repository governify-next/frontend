import { RolesList } from "./list";
import { ErrorPage } from "@/components/errors";
import { getOrganization } from "@/data/organizations/fetch";

export default async function OrganizationRolesPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const orgName = decodeURIComponent(name);

  const result = await getOrganization(orgName);

  if (!result.ok) {
    return (
      <ErrorPage
        result={result}
        message="Something went wrong while fetching organization roles."
      />
    );
  }

  const roles = result.data.roles;

  return <RolesList orgName={orgName} roles={roles} />;
}
