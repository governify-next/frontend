"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  House,
  Network,
  Settings,
  Shield,
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
      icon: FileText,
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
      icon: Shield,
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
    <Tabs
      value={active}
      className="@container/tabs shrink-0 border-b px-4"
    >
      <TabsList
        variant="line"
        className="w-full gap-2 p-0 group-data-horizontal/tabs:h-10 @3xl/tabs:-ml-1.5 @3xl/tabs:w-fit @3xl/tabs:gap-6"
      >
        {baseTabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="h-full text-base after:bg-primary group-data-horizontal/tabs:after:-bottom-px"
            asChild
          >
            <Link href={tab.href}>
              <tab.icon />
              <span
                className={cn(
                  tab.value !== active && "sr-only @3xl/tabs:not-sr-only",
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
