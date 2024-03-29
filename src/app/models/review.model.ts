import { Trail } from "./trail.model";

export interface Review extends Trail{
  id?: string | null;
  userId: string;
  rating: number;
  remarks: string;
  isAnonymous: boolean;
}
