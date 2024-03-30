import { Doctor } from "./doctor.model";
import { Person } from "./person.model";
import { Role } from "./role.model";
import { Trail } from "./trail.model";

export interface UserData extends Trail {
  id?: string | null; 
  authId: string | null;
  person: Person;
  roleId: string;
  clinicId?: string;
  favoriteDoctorId?: string | null;

  role?: Role;
  doctor?: Doctor;
}
