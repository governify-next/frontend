"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileSignature,
  House,
  Network,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/cn";

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
      icon: Network,
    },
    {
      value: "agreements",
      label: "Agreements",
      href: `${base}/agreements`,
      icon: FileSignature,
    },
  ];
  const adminTabs = [
    {
      value: "members",
      label: "Members",
      href: `${base}/members`,
      icon: Users,
    },
    {
      value: "roles",
      label: "Roles",
      href: `${base}/roles`,
      icon: ShieldCheck,
    },
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
      <TabsList
        variant="line"
        className="w-full gap-2 @3xl/main:w-fit @3xl/main:gap-6"
      >
        {baseTabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="text-base"
            asChild
          >
            <Link href={tab.href}>
              <tab.icon />
              <span
                className={cn(
                  tab.value !== active && "sr-only @3xl/main:not-sr-only",
                )}
              >
                {tab.label}
              </span>
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
