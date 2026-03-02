"use client";

import * as React from "react";
import {
  LifeBuoy,
  Send,
  Settings2,
  SquareTerminal,
  ClipboardList,
  ScrollTextIcon,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
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

import { Link } from "react-router-dom";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Management",
      icon: SquareTerminal,
      isActive: true,
      show: (role) => role === "admin" || role === "owner",
      items: [
        {
          title: "Menu",
          url: "../dashboard/menu",
        },
        {
          title: "Employees",
          url: "../dashboard/employees",
        },
      ],
    },
    {
      title: "Settings",
      icon: Settings2,
      items: [
        {
          title: "Dark Mode",
          switch: true,
        },
        {
          title: "Language",
          switch: true,
        },
      ],
    },
    {
      icon: ScrollTextIcon,
      title: "Orders",
      url: "../dashboard/orders",
      isLike: true,
    },
    {
      title: "Make Order",
      icon: ClipboardList,
      url: "../dashboard/orders/new",
      isLike: true,
    },
  ],

  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};
import { useAuth } from "@/hooks/useAuth";

export function AppSidebar({ ...props }) {
  const { user } = useAuth();

  const sidebarItems = data.navMain.filter((item) =>
    item.show ? item.show(user.role) : true,
  );

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="../dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  AZ
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Zaki Dashboard</span>
                  <span className="truncate text-xs">
                    Plan:{" "}
                    <span className="text-green-500 font-semibold">Free</span>
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
