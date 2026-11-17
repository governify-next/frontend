import { redirect } from "next/navigation";

export default async function OrganizationHomePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  redirect(`/organizations/${name}/agreements`);
}
