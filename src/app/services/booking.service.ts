import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, Query, addDoc, collection, collectionData, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { Collections } from '../constants/collections.constants';
import { GlobalService } from './global.service';
import { Observable, map } from 'rxjs';
import { Booking } from '../models/booking-details.model';
import { ScheduleOptions } from '@capacitor/local-notifications';
import { NotificationConstants } from '../constants/notification.constants';
import { BookingStatus } from '../constants/booking-status.enum';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingsCollection: CollectionReference<DocumentData>;

  constructor(private _fireStore: Firestore, private _globalService: GlobalService) {
    this.bookingsCollection = collection(this._fireStore, Collections.BOOKINGS);
  }
  
  async saveBooking(booking: Booking): Promise<string>{
    try{
      const res = await addDoc(this.bookingsCollection, booking);
      return res.id;
    }catch(e) {
      throw(e);
    }
  }

  async updateBooking(updatedModel: any): Promise<void> {
    try{
      const docInstance = doc(this._fireStore, Collections.BOOKINGS, updatedModel.id);
      await updateDoc(docInstance, updatedModel)
    }catch(e) {
      throw(e);
    }
  }

  fetchBookingsByClinicIdAsync(clinicId: string): Observable<Booking[]> {
    const collectionRef = query(this.bookingsCollection, where('clinicId', '==', clinicId));
    return this.fetchBookingsAsync(collectionRef);
  }

  fetchBookingsByPatientIdAsync(userId: string): Observable<Booking[]> {
    const collectionRef = query(this.bookingsCollection, where('patientId', '==', userId));
    return this.fetchBookingsAsync(collectionRef);
  }

  fetchAllActiveBookingsAsync(): Observable<Booking[]> {
    const collectionRef = query(this.bookingsCollection, where('bookingStatus', 'in', [BookingStatus.QUEUED]));
    return this.fetchBookingsAsync(collectionRef);
  }

  fetchAllBookings(): Observable<Booking[]> {
    return this.fetchBookingsAsync(this.bookingsCollection);
  }

  fetchBookingsAsync(query: Query): Observable<Booking[]> {
    return collectionData(query, { idField: 'id'})
      .pipe(
        map((bookings: any[]) => {
          return bookings.map((item) => {
            return { 
              ...item, 
              bookingDate: item.bookingDate.toDate(),
              createdAt: item.createdAt.toDate(),
              updatedAt: item.updatedAt.toDate(),
              review: item.review ? {
                ...item.review,
                updatedAt: item.review.updatedAt?.toDate(),
                createdAt: item.review.createdAt?.toDate(),
              } : undefined
            };
          });
        }),
        map((bookings: Booking[]) => this._globalService.sortData({active: 'bookingDate', direction: 'asc'}, bookings)),
      )
  }
  
  createBookingNotification(id: number, title: string, message: string): ScheduleOptions{
    let options: ScheduleOptions = {
      notifications: [
        {
          id,
          title,
          body: message,
          largeIcon: NotificationConstants.LARGE_ICON_PATH,
          smallIcon: NotificationConstants.SMALL_ICON_PATH,
        }
      ]
    };

    return options;
  }
}
