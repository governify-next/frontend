import { ErrorPage } from "@/components/errors";
import {
  getOrganization,
  getOrganizationInviteToken,
} from "@/data/organizations/fetch";
import { isUserAdminOfOrganization } from "@/data/organizations/actions";
import { InviteZone } from "./_components/invite-zone";
import { DangerZone } from "./_components/danger-zone";
import { OrganizationDetails } from "./_components/details";

export default async function OrganizationSettingsPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const orgName = decodeURIComponent(name);

  const [organizationResult, adminResult] = await Promise.all([
    getOrganization(orgName),
    isUserAdminOfOrganization(orgName),
  ]);

  if (!organizationResult.ok) {
    return (
      <ErrorPage
        result={organizationResult}
        message="Something went wrong while fetching organization."
      />
    );
  }

  if (!adminResult.ok) {
    return (
      <ErrorPage
        result={adminResult}
        message="Something went wrong while checking if user is admin of organization."
      />
    );
  }

  if (!adminResult.data.isAdmin) {
    return (
      <ErrorPage
        result={{
          ok: false,
          error: "Insufficient permissions",
          status: 403,
        }}
        message="You need admin permissions to manage this organization's settings."
      />
    );
  }

  const organization = organizationResult.data;

  const tokenResult = await getOrganizationInviteToken(organization.name);

  const token = tokenResult.ok ? tokenResult.data : null;

  return (
    <div className="flex flex-col gap-6">
      <OrganizationDetails organization={organization} />
      <InviteZone organization={organization} token={token} />
      <DangerZone orgName={organization.name} />
    </div>
  );
}
