"use client";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { SettingsIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";

const routes = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: "/members",
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
];

interface NavigationProps {
  isCollapsed?: boolean;
}

export const Navigation = ({ isCollapsed = false }: NavigationProps) => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const fullHref = workspaceId
          ? `/workspaces/${workspaceId}${item.href}`
          : "/";
        const isActive = pathname === fullHref;
        const Icon = isActive ? item.activeIcon : item.icon;
        return (
          <Link key={item.href} href={fullHref}>
            <div
              title={item.label}
              className={cn(
                "flex items-center p-2.5 rounded-md font-medium",
                isCollapsed ? "justify-center" : "gap-2.5",
                isActive
                  ? "bg-black text-white shadow-sm"
                  : "text-black hover:bg-slate-300 transition"
              )}
            >
              <Icon className="size-5" />
              {!isCollapsed && item.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
