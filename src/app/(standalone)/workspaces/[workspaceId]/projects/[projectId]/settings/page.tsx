import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { ProjectIdSettingsClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Project",
};

const ProjectIdSettingsPage = async () => {
  return (
    <div className="w-full lg:max-w-xl">
      <ProjectIdSettingsClient />
    </div>
  );
};

export default ProjectIdSettingsPage;
