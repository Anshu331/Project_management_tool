import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { WorkspaceIdSettingsClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Workspace",
};

const WorkspaceIdSettingsPage = async () => {
  return (
    <div className="w-full lg:max-w-xl">
      <WorkspaceIdSettingsClient />
    </div>
  );
};

export default WorkspaceIdSettingsPage;
