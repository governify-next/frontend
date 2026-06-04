import { SystemRole } from "@/types/user.types";
import { Skeleton } from "@/components/ui/skeleton";
import * as React from "react";
import { Building2, Command, Users } from "lucide-react";

import { NavItems } from "@/components/nav-items";
import { NavUser } from "@/components/nav-user";
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

const data = {
  navItems: [
    {
      title: "Organizations",
      url: "/organizations",
      icon: Building2,
      roles: [SystemRole.USER, SystemRole.ADMIN],
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
      roles: [SystemRole.ADMIN],
    },
  ],
};

function NavUserSkeleton() {
  return (
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
  );
}

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const userInfo = (await getCurrentUser()) ?? {
    username: "user123",
    systemRole: SystemRole.USER,
    name: "Usuario",
    email: "No disponible",
    avatar: null,
  };

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
      <SidebarContent>
        <NavItems
          items={data.navItems.filter((item) =>
            item.roles.includes(userInfo.systemRole),
          )}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userInfo} />
      </SidebarFooter>
    </Sidebar>
  );
}
