import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, query, updateDoc, where } from '@angular/fire/firestore';
import { BehaviorSubject, map } from 'rxjs';
import { ClinicSchedule } from '../models/clinic-schedule.model';
import { GlobalService } from './global.service';
import { Collections } from '../constants/collections.constants';

@Injectable()
export class ClinicScheduleService {
  private clinicSchedulesCollection: CollectionReference<DocumentData>;
  private _clinicSchedules = new BehaviorSubject<ClinicSchedule[]>([]);

  get clinicSchudules() {
    return this._clinicSchedules.asObservable();
  }

  constructor(private _fireStore: Firestore, private _globalService: GlobalService) {
    this.clinicSchedulesCollection = collection(this._fireStore, Collections.CLINIC_SCHEDULES);
  }
  
  async saveClinicSchedule(clinicSchedule: ClinicSchedule): Promise<string>{
    try{
      const res = await addDoc(this.clinicSchedulesCollection, clinicSchedule);
      return res.id;
    }catch(e) {
      throw(e);
    }
  }
  
  async updateClinicSchedule(updatedModel: any): Promise<void> {
    try{
      const docInstance = doc(this._fireStore, Collections.CLINIC_SCHEDULES, updatedModel.id);
      return updateDoc(docInstance, updatedModel)
    }catch(e) {
      throw(e);
    }
  }

  async fetchClinicSchedulesById(clinicId: string): Promise<ClinicSchedule[]> {
    try{
      let clinicSchedules = await new Promise<ClinicSchedule[]>((resolve, reject) => {
        const collectionRef = query(this.clinicSchedulesCollection, where('clinicId', '==', clinicId));
        return collectionData(collectionRef, { idField: 'id'})
          .pipe(
            map((clinicSchedules: any[]) => {
              return clinicSchedules.map((item) => {
                return { 
                  ...item, 
                  createdAt: item.createdAt.toDate(),
                  updatedAt: item.updatedAt.toDate(),
                };
              });
            }),
            map((clinicSchedules: ClinicSchedule[]) => this._globalService.sortData({active: 'dayOfWeek', direction: 'asc'}, clinicSchedules))
          )
          .subscribe({
            next: (clinicSchedules: ClinicSchedule[]) => {
              resolve(clinicSchedules);
            },
            error: (err: any) => {
              reject(err);
            }
          });
      });
  
      return clinicSchedules;
    }catch(e) {
      throw(e);
    }
  }

  async deleteClinicSchedule(clinicId: string): Promise<void>{
    try{
      await deleteDoc(doc(this._fireStore, `${Collections.CLINIC_SCHEDULES}/${clinicId}`));
    }catch(e) {
      throw(e);
    }
  }
}
