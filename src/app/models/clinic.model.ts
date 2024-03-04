import { LocationData } from "./location.model";
import { Trail } from "./trail.model";

export interface Clinic extends Trail {
  id?: string;
  name: string;
  location: LocationData;
  telephoneNumber?: string;
  mobileNumber: string;
  dailyVisitLimit: number;
  isApproved: boolean;
  staffIds: string[];
  doctorId?: string;
}