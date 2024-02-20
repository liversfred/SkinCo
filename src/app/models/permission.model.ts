import { Trail } from "./trail.model";

export interface Permission extends Trail {
  id?: string;
  name: string;
}