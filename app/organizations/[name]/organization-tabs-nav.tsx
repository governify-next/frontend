"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function OrganizationTabsNav({ orgName }: { orgName: string }) {
  const pathname = usePathname();
  const base = `/organizations/${orgName}`;
  const tabs = [
    { value: "home", label: "Home", href: base },
    { value: "members", label: "Members", href: `${base}/members` },
    { value: "settings", label: "Settings", href: `${base}/settings` },
  ];
  const active =
    tabs.find((t) => t.href !== base && pathname.startsWith(t.href))?.value ??
    "home";

  return (
    <Tabs value={active} className="w-full">
      <TabsList variant="line" className="gap-6">
        {tabs.map((t) => (
          <TabsTrigger key={t.value} value={t.value} className="text-base" asChild>
            <Link href={t.href}>{t.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
