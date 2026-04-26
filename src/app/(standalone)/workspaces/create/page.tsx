import { getCurrent } from "@/features/auth/queries";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

// either Static metadata
export const metadata: Metadata = {
  title: "Create Workspace",
};

const WorkspaceCreatePage = async () => {
  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default WorkspaceCreatePage;
