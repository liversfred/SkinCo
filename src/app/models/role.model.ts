import { Permission } from "./permission.model";
import { Trail } from "./trail.model";

export interface Role extends Trail {
  id?: string | null; 
  name: string;
  permissions?: Permission[];
}
