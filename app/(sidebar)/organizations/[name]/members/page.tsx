import { MembersList } from "./list";
import { ErrorPage } from "@/components/errors";
import {
  getOrganization,
  getOrganizationMembers,
} from "@/data/organizations/fetch";

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

  if (!membersResult.ok) {
    return <ErrorPage result={membersResult} message={ERROR_MESSAGE} />;
  }

  if (!organizationResult.ok) {
    return <ErrorPage result={organizationResult} message={ERROR_MESSAGE} />;
  }

  return (
    <MembersList
      members={membersResult.data}
      organization={organizationResult.data}
    />
  );
}
