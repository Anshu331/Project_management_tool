import { getWorkspaces } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

export default async function Home() {
  const workspaces = await getWorkspaces();
  if (workspaces.total === 0) {
    redirect("/workspaces/create");
  } else {
    const workspace = workspaces.documents[0];
    redirect(`/workspaces/${workspace.$id}`);
  }
}
