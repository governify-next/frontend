import { getCurrentUser } from "@/lib/auth/session";
import {
  getOrganization,
  getOrganizationMembers,
} from "@/lib/organizations/fetch";
import { MembersAdminActions } from "./members-admin-actions";
import { MembersList } from "./members-list";
import { ErrorPage } from "@/components/errors";

export default async function OrganizationMembersPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const orgName = decodeURIComponent(name);

  const [userResult, membersResult, organizationResult] = await Promise.all([
    getCurrentUser(),
    getOrganizationMembers(orgName),
    getOrganization(orgName),
  ]);

  const ERROR_MESSAGE =
    "Something went wrong while fetching organization members.";

  if (!userResult.ok)
    return <ErrorPage result={userResult} message={ERROR_MESSAGE} />;
  if (!membersResult.ok)
    return <ErrorPage result={membersResult} message={ERROR_MESSAGE} />;
  if (!organizationResult.ok)
    return <ErrorPage result={organizationResult} message={ERROR_MESSAGE} />;

  const members = membersResult.data;
  const user = userResult.data;
  const roles = organizationResult.data.roles;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 pt-4">
      <div className="text-end gap-2">
        <MembersAdminActions orgName={orgName} />
      </div>
      <MembersList
        members={members}
        organization={organizationResult.data}
        currentUserId={user._id}
        roles={roles}
      />
    </div>
  );
}
