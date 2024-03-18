import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, Query, addDoc, collection, collectionData, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { Collections } from '../constants/collections.constants';
import { GlobalService } from './global.service';
import { Observable, map } from 'rxjs';
import { Booking } from '../models/booking-details.model';

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

  fetchBookingsByUserIdAsync(userId: string): Observable<Booking[]> {
    const collectionRef = query(this.bookingsCollection, where('userId', '==', userId));
    return this.fetchBookingsAsync(collectionRef);
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
            };
          });
        }),
        map((bookings: Booking[]) => this._globalService.sortData({active: 'bookingDate', direction: 'asc'}, bookings))
      )
  }
}
