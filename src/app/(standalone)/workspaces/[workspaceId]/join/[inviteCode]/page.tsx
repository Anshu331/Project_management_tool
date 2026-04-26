import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { WorkspaceIdJoinClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Workspace",
};

const WorkspaceIdJoinPage = async () => {
  return (
    <div className="w-full lg:max-w-xl">
      <WorkspaceIdJoinClient />
    </div>
  );
};

export default WorkspaceIdJoinPage;
