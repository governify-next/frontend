"use client";

import type { BasicUserInfo } from "@/types/user.types";
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

import useSWR from "swr";
import { fetcher } from "@/lib/utils/fetcher";

const data = {
  navItems: [
    {
      title: "Organizations",
      url: "/organizations",
      icon: Building2,
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userResponse, isLoading } = useSWR<{
    data: BasicUserInfo | null;
  }>("/api/me", fetcher);
  const user = userResponse?.data ?? {
    username: "user123",
    name: "Usuario",
    email: "No disponible",
    avatar: null,
  };

  console.log(user);

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
        <NavItems items={data.navItems} />
      </SidebarContent>
      <SidebarFooter>
        {isLoading ? <NavUserSkeleton /> : <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
