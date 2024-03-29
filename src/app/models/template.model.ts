import { TemplateType } from "../constants/template-types.constants";
import { Trail } from "./trail.model";

export interface Template extends Trail {
  id?: string | null; 
  clinicId: string;
  content: string;
  templateType: TemplateType
}
