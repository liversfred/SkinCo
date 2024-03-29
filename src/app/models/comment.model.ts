import { Trail } from "./trail.model";

export interface Comment extends Trail{
  id?: string | null;
  parentId: string;
  comment: string;
}
