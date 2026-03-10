import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, Link, useLocation } from "react-router-dom";
import React from "react";
import { useEffect } from "react";

import { useOrdersRealtime } from "@/hooks/useOrdersRealtime";
import OneSignal from "react-onesignal";
import { supabase } from "@/lib/supabase";

import ThemeSwitcher from "@/components/shared/ThemeSwitcher";

export default function DashboardLayout() {
  useEffect(() => {
    const initOneSignal = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (!userId) {
          console.log("No active session found for OneSignal");
          return;
        }
        await OneSignal.init({
          appId: "2b1a2a08-fa45-43cd-b4ca-33e02f06a317",
          serviceWorkerPath: "/OneSignalSDKWorker.js",
          notifyButton: {
            enable: true,
          },
        });

        await OneSignal.login(userId);
        console.log("OneSignal linked to user:", userId);

        console.log("OneSignal is ready!");
      } catch (err) {
        console.error("OneSignal Init Error:", err);
      }
    };
    initOneSignal();
  }, []);

  useOrdersRealtime();

  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <Breadcrumb>
              <BreadcrumbList>
                {pathnames.map((value, index) => {
                  const isLast = index === pathnames.length - 1;
                  const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                  const label = value.charAt(0).toUpperCase() + value.slice(1);

                  return (
                    <React.Fragment key={to}>
                      <BreadcrumbItem className="">
                        {isLast ? (
                          <BreadcrumbPage>{label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={to}>{label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator className="" />}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className=" flex relative flex-1 flex-col gap-4 p-4 pt-0">
          <ThemeSwitcher />
          <Outlet />
          <Toaster position="top-center" richColors closeButton />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
