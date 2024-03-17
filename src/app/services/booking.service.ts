import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { Collections } from '../constants/collections.constants';
import { GlobalService } from './global.service';
import { map } from 'rxjs';
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
  
  async fetchBookingsById(userId: string): Promise<Booking[]> {
    try{
      let bookings = await new Promise<Booking[]>((resolve, reject) => {
        const collectionRef = query(this.bookingsCollection, where('userId', '==', userId));
        return collectionData(collectionRef, { idField: 'id'})
          .pipe(
            map((bookings: any[]) => {
              return bookings.map((item) => {
                return { 
                  ...item, 
                  createdAt: item.createdAt.toDate(),
                  updatedAt: item.updatedAt.toDate(),
                };
              });
            }),
            map((bookings: Booking[]) => this._globalService.sortData({active: 'bookingDate', direction: 'asc'}, bookings))
          )
          .subscribe({
            next: (bookings: Booking[]) => {
              resolve(bookings);
            },
            error: (err: any) => {
              reject(err);
            }
          });
      });
  
      return bookings;
    }catch(e) {
      throw(e);
    }
  }
}
