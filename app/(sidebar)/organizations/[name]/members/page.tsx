import {
  getOrganization,
  getOrganizationMembers,
} from "@/data/organizations/fetch";
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
    <MembersList
      members={members}
      organization={organizationResult.data}
      roles={roles}
    />
  );
}
