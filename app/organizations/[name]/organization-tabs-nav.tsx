"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  const baseTabs = [{ value: "home", label: "Home", href: base }];
  const adminTabs = [
    { value: "members", label: "Members", href: `${base}/members` },
    { value: "roles", label: "Roles", href: `${base}/roles` },
    { value: "settings", label: "Settings", href: `${base}/settings` },
  ];

  if (isAdmin) {
    baseTabs.push(...adminTabs);
  }

  const active =
    baseTabs.find((tab) => tab.href !== base && pathname.startsWith(tab.href))
      ?.value ?? "home";

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
            <Link href={tab.href}>{tab.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
