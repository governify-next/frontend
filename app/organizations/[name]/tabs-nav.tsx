"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderTree, House, Settings, ShieldCheck, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function OrganizationTabsNav({
  orgName,
  isAdmin,
}: {
  orgName: string;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const base = `/organizations/${orgName}`;

  const baseTabs = [
    { value: "overview", label: "Home", href: base, icon: House },
    {
      value: "scopes",
      label: "Scopes",
      href: `${base}/scopes`,
      icon: FolderTree,
    },
  ];
  const adminTabs = [
    { value: "members", label: "Members", href: `${base}/members`, icon: Users },
    { value: "roles", label: "Roles", href: `${base}/roles`, icon: ShieldCheck },
    {
      value: "settings",
      label: "Settings",
      href: `${base}/settings`,
      icon: Settings,
    },
  ];

  if (isAdmin) {
    baseTabs.push(...adminTabs);
  }

  const active =
    baseTabs.find((tab) => tab.href !== base && pathname.startsWith(tab.href))
      ?.value ?? "overview";

  return (
    <Tabs value={active} className="w-full">
      <TabsList variant="line" className="gap-6">
        {baseTabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="text-base"
            asChild
          >
            <Link href={tab.href}>
              <tab.icon />
              {tab.label}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
