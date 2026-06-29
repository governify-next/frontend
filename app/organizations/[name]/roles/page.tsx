import { roleMocks } from "@/app/mocks/change-role-mocks";
import { RolesList } from "./roles-list";
import { RoleNav } from "./roles-nav";
import { getRoles } from "../../utils";

export default async function OrganizationRolesPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const orgName = decodeURIComponent(name);

  const roles = await getRoles(orgName);

  return (
    <div className="mx-auto max-w-7xl pt-4 flex flex-col gap-4">
      <RoleNav orgName={orgName} />
      <RolesList orgName={orgName} roles={roles} />
    </div>
  );
}
