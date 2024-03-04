import { Trail } from "./trail.model";

export interface Specialization extends Trail {
  id?: string | null; 
  name: string;
}
