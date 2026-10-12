import {
  getOrganization,
  getOrganizationMembers,
} from "@/data/organizations/fetch";
import { MembersAdminActions } from "./admin-actions";
import { MembersList } from "./list";
import { ErrorPage } from "@/components/errors";

export default async function OrganizationMembersPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const orgName = decodeURIComponent(name);

  const [membersResult, organizationResult] = await Promise.all([
    getOrganizationMembers(orgName),
    getOrganization(orgName),
  ]);

  const ERROR_MESSAGE =
    "Something went wrong while fetching organization members.";

  if (!membersResult.ok)
    return <ErrorPage result={membersResult} message={ERROR_MESSAGE} />;
  if (!organizationResult.ok)
    return <ErrorPage result={organizationResult} message={ERROR_MESSAGE} />;

  const members = membersResult.data;
  const roles = organizationResult.data.roles;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 pt-4">
      <div className="text-end gap-2">
        <MembersAdminActions orgName={orgName} />
      </div>
      <MembersList
        members={members}
        organization={organizationResult.data}
        roles={roles}
      />
    </div>
  );
}
