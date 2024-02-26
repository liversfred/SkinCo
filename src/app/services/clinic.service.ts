import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Collections } from '../constants/collections.constants';
import { Clinic } from '../models/clinic.model';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  private clinicsCollection: CollectionReference<DocumentData>;

  constructor(private _fireStore: Firestore) {
    this.clinicsCollection = collection(this._fireStore, Collections.CLINICS);
   }

   async saveClinic(clinic: Clinic): Promise<string>{
    try{
      const res = await addDoc(this.clinicsCollection, clinic);
      return res.id;
    }catch(e) {
      throw(e);
    }
   }

  //  async fetchClinic(): Promise<Clinic | null> {
  //   try{
  //     const res = await 
  //   }
  //  }
}
