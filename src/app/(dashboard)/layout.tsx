"use client";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";
import { EditTaskModal } from "@/features/tasks/components/edit-task-modal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { useEffect, useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("pm.sidebar.collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("pm.sidebar.collapsed", String(isCollapsed));
  }, [isCollapsed]);

  return (
    <div className="min-h-screen">
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <EditTaskModal />
      <div className="flex w-full h-full">
        <div
          className={`fixed left-0 top-0 lg:block hidden h-full overflow-y-auto transition-all duration-200 ${
            isCollapsed ? "lg:w-[80px]" : "lg:w-[256px]"
          }`}
        >
          <Sidebar
            isCollapsed={isCollapsed}
            onToggle={() => setIsCollapsed((prev) => !prev)}
          />
        </div>
        <div
          className={`w-full transition-all duration-200 ${
            isCollapsed ? "lg:pl-[88px]" : "lg:pl-[264px]"
          }`}
        >
          <div className="mx-auto max-w-screen-2xl h-full">
            <Navbar />
            <main className="py-8 px-6 flex flex-col h-full">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
