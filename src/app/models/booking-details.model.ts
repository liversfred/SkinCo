import { BookingStatus } from "../constants/booking-status.enum";
import { ClinicServiceData } from "./clinic-service-data.model";
import { Clinic } from "./clinic.model";
import { Trail } from "./trail.model";
import { UserData } from "./user-data.model";

export interface Booking extends Trail{
  id?: string | null;
  bookingNo: string;
  bookingDate: Date;
  patientId: string;
  clinicId: string;
  remarks?: string;
  clinicServiceIds: string[];
  bookingStatus: BookingStatus;
  cancellationReason?: string;

  clinicServices?: ClinicServiceData[];
  clinic?: Clinic;
  patient?: UserData;
}
