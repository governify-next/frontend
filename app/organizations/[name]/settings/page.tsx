import { getOrganization } from "@/data/organizations/fetch";
import { UpdateOrganizationForm } from "./update-organization-form";
import { DangerZone } from "./danger-zone";
import { ErrorPage } from "@/components/errors";
import { isUserAdminOfOrganization } from "@/data/organizations/actions";

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
        message="Something went wrong while checking if user is admin of organization."
      />
    );
  }

  const organization = organizationResult.data;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 pt-4">
      <UpdateOrganizationForm organization={organization} />
      <DangerZone orgName={organization.name} />
    </div>
  );
}
