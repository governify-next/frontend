import { getOrganization } from "@/lib/organizations/fetch";
import { UpdateOrganizationForm } from "./update-organization-form";
import { DangerZone } from "./danger-zone";
import { ErrorPage } from "@/components/errors";

export default async function OrganizationSettingsPage({
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
        message="Something went wrong while fetching organization."
      />
    );
  }

  const organization = result.data;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 pt-4">
      <UpdateOrganizationForm organization={organization} />
      <DangerZone orgName={organization.name} />
    </div>
  );
}
