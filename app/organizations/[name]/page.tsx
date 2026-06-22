import { notFound } from "next/navigation";
import { getOrganization } from "@/lib/organizations/fetch";

export default async function OrganizationHomePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const result = await getOrganization(decodeURIComponent(name));
  if (!result) notFound();

  const { organization } = result;

  return (
    <div className="flex flex-col gap-1 pt-4">
      <h2 className="text-lg font-medium">
        {organization.displayName || organization.name}
      </h2>
      {organization.description && (
        <p className="text-sm text-muted-foreground">{organization.description}</p>
      )}
    </div>
  );
}
