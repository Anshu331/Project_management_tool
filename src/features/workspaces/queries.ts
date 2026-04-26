import { Query } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { guestWorkspacesData, IS_GUEST_MODE } from "@/lib/guest";

export const getWorkspaces = async () => {
  if (IS_GUEST_MODE) {
    return guestWorkspacesData;
  }
  if (
    !process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
    !process.env.NEXT_PUBLIC_APPWRITE_PROJECT ||
    !DATABASE_ID ||
    !MEMBERS_ID ||
    !WORKSPACES_ID
  ) {
    return { documents: [], total: 0 };
  }
  try {
    const { databases, account } = await createSessionClient();
    const user = await account.get();
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userid", user.$id),
    ]);
    if (members.total === 0) {
      return { documents: [], total: 0 };
    }
    const workspaceIds = members.documents.map((member) => member.workspaceId);
    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );
    return workspaces;
  } catch {
    return { documents: [], total: 0 };
  }
};
