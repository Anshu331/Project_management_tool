import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { WorkspaceIdClient } from "./client";

const WorkSpaceIdPage = async () => {
  return <WorkspaceIdClient />;
};

export default WorkSpaceIdPage;
