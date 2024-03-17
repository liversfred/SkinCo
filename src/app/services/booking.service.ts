import { Injectable } from '@angular/core';
import { BookingDetails } from '../models/booking-details.model';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, doc, updateDoc } from '@angular/fire/firestore';
import { Collections } from '../constants/collections.constants';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingsCollection: CollectionReference<DocumentData>;

  constructor(private _fireStore: Firestore, private _globalService: GlobalService) {
    this.bookingsCollection = collection(this._fireStore, Collections.BOOKINGS);
  }
  
  async saveBooking(bookingDetails: BookingDetails): Promise<string>{
    try{
      const res = await addDoc(this.bookingsCollection, bookingDetails);
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
}
