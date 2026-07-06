import { SystemRole } from "@/types/user.types";
import { Skeleton } from "@/components/ui/skeleton";
import * as React from "react";
import { Suspense } from "react";
import { Building2, Command, Users } from "lucide-react";

import { NavItems } from "@/components/sidebar/nav-items";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/auth/session";
import { ErrorPage } from "../errors";

const data = {
  navItems: [
    {
      title: "Organizations",
      url: "/organizations",
      icon: Building2,
      roles: [SystemRole.USER, SystemRole.ADMIN, SystemRole.SUPERADMIN],
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
      roles: [SystemRole.ADMIN, SystemRole.SUPERADMIN],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Governify Next</span>
                  <span className="truncate text-xs">Workspace</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <Suspense fallback={<SidebarUserSectionSkeleton />}>
        <SidebarUserSection />
      </Suspense>
    </Sidebar>
  );
}

async function SidebarUserSection() {
  const result = await getCurrentUser();
  if (!result.ok) {
    return (
      <ErrorPage
        result={result}
        message="Something went wrong while fetching current user."
      />
    );
  }

  const user = result.data;

  return (
    <>
      <SidebarContent>
        <NavItems
          items={data.navItems.filter((item) =>
            item.roles.includes(user.systemRole),
          )}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </>
  );
}

function SidebarUserSectionSkeleton() {
  return (
    <>
      <SidebarContent>
        <SidebarMenu className="gap-2 p-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Skeleton className="size-4 shrink-0 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
              <div className="grid flex-1 gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
