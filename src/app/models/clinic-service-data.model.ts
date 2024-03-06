import { Trail } from "./trail.model";

export interface ClinicServiceData extends Trail {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imagePath?: string;
}