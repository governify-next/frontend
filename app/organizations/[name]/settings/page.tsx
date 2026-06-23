import { notFound } from "next/navigation";
import { getOrganization } from "@/lib/organizations/fetch";
import { UpdateOrganizationForm } from "./update-organization-form";
import { DangerZone } from "./danger-zone";

export default async function OrganizationSettingsPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const orgName = decodeURIComponent(name);

  const result = await getOrganization(orgName);
  if (!result) notFound();

  const { organization } = result;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 pt-4">
      <UpdateOrganizationForm organization={organization} />
      <DangerZone orgName={organization.name} />
    </div>
  );
}
