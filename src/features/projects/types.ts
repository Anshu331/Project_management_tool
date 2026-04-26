import { Document } from "@/types/document";

export type Project = Document & {
  name: string;
  imageUrl: string;
  workspaceId: string;
};
