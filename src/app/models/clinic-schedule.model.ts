import { Trail } from "./trail.model";

export interface ClinicSchedule extends Trail{
  id?: string | null;
  clinicId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}
