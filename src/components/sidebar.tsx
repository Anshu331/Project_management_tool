"use client";

import Link from "next/link";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Projects } from "./projects";
import { DottedSeparator1 } from "./dotted-separator copy";
import { Button } from "./ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar = ({ isCollapsed = false, onToggle }: SidebarProps) => {
  return (
    <aside className="h-full p-4 w-full bg-white text-black">
      <div className="flex items-center justify-between gap-x-2">
        <Link href="/" className="min-w-0">
          <div className="flex items-center gap-x-4">
            {!isCollapsed && (
              <span className="font-bold text-2xl text-center truncate">
                ProjectManagementTool
              </span>
            )}
          </div>
        </Link>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="shrink-0"
          onClick={onToggle}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </Button>
      </div>
      <DottedSeparator1 className="my-4" />
      {!isCollapsed && <WorkspaceSwitcher />}
      {!isCollapsed && <DottedSeparator1 className="my-4" />}
      <Navigation isCollapsed={isCollapsed} />
      {!isCollapsed && <DottedSeparator1 className="my-4" />}
      {!isCollapsed && <Projects />}
    </aside>
  );
};
