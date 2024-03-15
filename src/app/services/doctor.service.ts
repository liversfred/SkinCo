import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, docData, query, updateDoc, where } from '@angular/fire/firestore';
import { Collections } from '../constants/collections.constants';
import { Doctor } from '../models/doctor.model';
import { Observable, map } from 'rxjs';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private doctorsCollection: CollectionReference<DocumentData>;

  constructor(private _fireStore: Firestore, private _globalService: GlobalService) {
    this.doctorsCollection = collection(this._fireStore, Collections.DOCTORS);
  }
  
  async saveDoctor(doctor: Doctor): Promise<string>{
    try{
      const res = await addDoc(this.doctorsCollection, doctor);
      return res.id;
    }catch(e) {
      throw(e);
    }
  }

  async updateDoctor(updatedModel: any): Promise<void> {
    try{
      const docInstance = doc(this._fireStore, Collections.DOCTORS, updatedModel.id);
      await updateDoc(docInstance, updatedModel)
    }catch(e) {
      throw(e);
    }
  }

  async fetchDoctorById(doctorId: string): Promise<Doctor | null> {
    try{
      let doctor = await new Promise<Doctor>((resolve, reject) => {
        docData(doc(this._fireStore, `${Collections.DOCTORS}/${doctorId}`), { idField: 'id'})
          .pipe(
            map((doctorRef: any) => {
              if(!doctorRef) return null;
              if (doctorRef && doctorRef.isActive === false) {
                return null;
              } else {
                return {
                  ...doctorRef,
                  createdAt: doctorRef.createdAt.toDate(),
                  updatedAt: doctorRef.updatedAt.toDate(),
                  person: {
                    ...doctorRef.person,
                    fullName: this._globalService.formatFullName(doctorRef.person.firstName, doctorRef.person.middleName, doctorRef.person.lastName)
                  }
                };
              }
            })
          )
          .subscribe({
            next: (doctor: Doctor) => {
              resolve(doctor);
            },
            error: (err: any) => {
              reject(err);
            }
          });
      });

      return doctor;
    }catch(e) {
      throw(e);
    }
  }

  fetchDoctorsAsync(): Observable<Doctor[]> {
    const collectionRef = query(this.doctorsCollection, where('isActive', '==', true));
    return collectionData(collectionRef, { idField: 'id'})
    .pipe(
      map((doctors: any[]) => {
        return doctors.map((item) => {
          return { 
            ...item, 
            createdAt: item.createdAt.toDate(),
            updatedAt: item.updatedAt.toDate(),
            person: {
              ...item.person,
              fullName: this._globalService.formatFullName(item.person.firstName, item.person.middleName, item.person.lastName)
            }
          };
        });
      }),
      map((doctors: Doctor[]) => this._globalService.sortData({active: 'fullName', direction: 'asc'}, doctors)),
    );
  }
}
