import { ClinicServiceData } from "./clinic-service-data.model";
import { Trail } from "./trail.model";

export interface BookingDetails extends Trail{
  id?: string | null;
  bookingNo: string;
  bookingDate: Date;
  userId: string;
  clinicId: string;
  remarks?: string;
  clinicServiceIds: string[];

  clinicServices?: ClinicServiceData[];
}
