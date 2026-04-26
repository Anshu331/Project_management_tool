import { Document } from "@/types/document";

export type Workspace = Document & {
  name: string;
  imageUrl: string;
  inviteCode: string;
  userid?: string;
};
