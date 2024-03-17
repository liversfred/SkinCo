import { BookingStatus } from "../constants/booking-status.enum";
import { ClinicServiceData } from "./clinic-service-data.model";
import { Clinic } from "./clinic.model";
import { Trail } from "./trail.model";

export interface Booking extends Trail{
  id?: string | null;
  bookingNo: string;
  bookingDate: Date;
  userId: string;
  clinicId: string;
  remarks?: string;
  clinicServiceIds: string[];
  bookingStatus: BookingStatus;

  clinicServices?: ClinicServiceData[];
  clinic?: Clinic;
}
