import { RolesList } from "./list";
import { ErrorPage } from "@/components/errors";
import { getOrganization } from "@/data/organizations/fetch";
import { AddRole } from "./header-nav";

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

  return (
    <div className="mx-auto max-w-7xl pt-4 flex flex-col gap-4">
      <AddRole orgName={orgName} />
      <RolesList orgName={orgName} roles={roles} />
    </div>
  );
}
