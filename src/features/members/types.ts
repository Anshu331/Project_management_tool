import { Document } from "@/types/document";

export enum memberRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export type Member = Document & {
  workspaceId: string;
  userid: string;
  role: memberRole | "ADMIN" | "MEMBER";
  name: string;
  email: string;
};
