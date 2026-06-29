import { getCurrentUser } from "@/lib/auth/session";
import { getOrganizationMembers } from "@/lib/organizations/fetch";
import { MembersAdminActions } from "./members-admin-actions";
import { MembersList } from "./members-list";
import { getRoles } from "../../utils";
import { InputSearch } from "@/components/input-search";

export default async function OrganizationMembersPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const orgName = decodeURIComponent(name);

  const [user, result, roles] = await Promise.all([
    getCurrentUser(),
    getOrganizationMembers(orgName),
    getRoles(orgName),
  ]);
  const members = result?.members ?? [];

  const isOrgAdmin = members.some(
    (m) =>
      m.userId.username === user?.username &&
      m.roles.some((r) => r.name === "admin"),
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 pt-4">
      <div className="flex items-center gap-2">
        <InputSearch placeholder="Search members..." />
        {isOrgAdmin && <MembersAdminActions orgName={orgName} />}
      </div>
      <MembersList
        members={members}
        isOrgAdmin={isOrgAdmin}
        orgName={orgName}
        currentUsername={user?.username}
        roles={roles}
      />
    </div>
  );
}
