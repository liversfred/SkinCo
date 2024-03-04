import { Trail } from "./trail.model";

export interface BankDetails extends Trail{
  id?: string | null;
  clinicId: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
}
