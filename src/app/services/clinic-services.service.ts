import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { GlobalService } from './global.service';
import { Collections } from '../constants/collections.constants';
import { map } from 'rxjs';
import { ClinicServiceData } from '../models/clinic-service-data.model';

@Injectable({
  providedIn: 'root'
})
export class ClinicServicesService {
  private clinicServicessCollection: CollectionReference<DocumentData>;

  constructor(private _fireStore: Firestore, private _globalService: GlobalService) {
    this.clinicServicessCollection = collection(this._fireStore, Collections.CLINIC_SERVICES);
  }

  async saveClinicService(clinicService: ClinicServiceData): Promise<string>{
    try{
      const res = await addDoc(this.clinicServicessCollection, clinicService);
      return res.id;
    }catch(e) {
      throw(e);
    }
  }
   
  async updateClinicService(updatedModel: any): Promise<void> {
    try{
      const docInstance = doc(this._fireStore, Collections.CLINIC_SERVICES, updatedModel.id);
      await updateDoc(docInstance, updatedModel)
    }catch(e) {
      throw(e);
    }
  }

  async fetchClinicServices(clinicId: string): Promise<ClinicServiceData[]> {
    try{
      let clinicServices = await new Promise<ClinicServiceData[]>((resolve, reject) => {
        const collectionRef = query(this.clinicServicessCollection, 
          where('isActive', '==', true),
          where('clinicId', '==', clinicId)
        );
        collectionData(collectionRef, { idField: 'id'})
          .pipe(
            map((clinicServices: any[]) => {
              return clinicServices.map((item) => {
                return { 
                  ...item, 
                  createdAt: item.createdAt.toDate(),
                  updatedAt: item.updatedAt.toDate(),
                };
              });
            }),
            map((clinicServices: ClinicServiceData[]) => this._globalService.sortData({active: 'baseName', direction: 'asc'}, clinicServices)),
          )
          .subscribe({
            next: (clinicServices: ClinicServiceData[]) => {
              resolve(clinicServices);
            },
            error: (err: any) => {
              reject(err);
            }
          });
      });

      return clinicServices;
    }catch(e) {
      console.log(`Error occurred: ${e}`);
      return [];
    }
  }
}
