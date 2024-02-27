import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, collectionGroup, doc, docData, query, updateDoc, where } from '@angular/fire/firestore';
import { Collections } from '../constants/collections.constants';
import { Clinic } from '../models/clinic.model';
import { map } from 'rxjs';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  private clinicsCollection: CollectionReference<DocumentData>;

  constructor(private _fireStore: Firestore, private _globalService: GlobalService) {
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
   
  async updateClinic(updatedModel: any): Promise<void> {
    try{
      const docInstance = doc(this._fireStore, Collections.CLINICS, updatedModel.id);
      return updateDoc(docInstance, updatedModel)
    }catch(e) {
      throw(e);
    }
  }

  async fetchClinics(): Promise<Clinic[]> {
    try{
      let clinics = await new Promise<Clinic[]>((resolve, reject) => {
        const collectionRef = query(this.clinicsCollection, where('isActive', '==', true));
        collectionData(collectionRef, { idField: 'id'})
          .pipe(
            map((clinics: any[]) => {
              return clinics.map((item) => {
                return { 
                  ...item, 
                  createdAt: item.createdAt.toDate(),
                  updatedAt: item.updatedAt.toDate(),
                };
              });
            }),
            map((clinics: Clinic[]) => this._globalService.sortData({active: 'baseName', direction: 'asc'}, clinics as Clinic[])),
          )
          .subscribe({
            next: (clinics: Clinic[]) => {
              resolve(clinics);
            },
            error: (err: any) => {
              reject(err);
            }
          });
      });

      return clinics;
    }catch(e) {
      console.log(`Error occurred: ${e}`);
      return [];
    }
  }

   async fetchClinicById(clinicId: string): Promise<Clinic | null> {
    try{
      let clinic = await new Promise<Clinic>((resolve, reject) => {
        docData(doc(this._fireStore, `${Collections.CLINICS}/${clinicId}`), { idField: 'id'})
          .pipe(
            map((clinicRef: any) => {
              if(!clinicRef) return null;
              if (clinicRef && clinicRef.isActive === false) {
                return null;
              } else {
                return {
                  ...clinicRef,
                  createdAt: clinicRef.createdAt.toDate(),
                  updatedAt: clinicRef.updatedAt.toDate(),
                };
              }
            })
          )
          .subscribe({
            next: (clinic: Clinic) => {
              resolve(clinic);
            },
            error: (err: any) => {
              reject(err);
            }
          });
      });

      return clinic;
    }catch(e) {
      throw(e);
    }
   }
}
