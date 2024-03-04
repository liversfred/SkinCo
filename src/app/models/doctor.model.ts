import { Person } from "./person.model";
import { Specialization } from "./speicialization.model";
import { Trail } from "./trail.model";

export interface Doctor extends Trail{
  id?: string | null;
  person: Person;
  specialization: Specialization;
}
