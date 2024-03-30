import { Booking } from "./booking-details.model";
import { Trail } from "./trail.model";
import { UserData } from "./user-data.model";

export interface CommentData extends Trail{
  id?: string | null;
  userId: string;
  parentId: string;
  comment: string;
  isAnonymous: boolean;

  user?: UserData;
  booking?: Booking;
}
