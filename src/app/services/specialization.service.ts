import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, collection, collectionData } from '@angular/fire/firestore';
import { GlobalService } from './global.service';
import { Collections } from '../constants/collections.constants';
import { Specialization } from '../models/speicialization.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpecializationService {
  private specializationsCollection: CollectionReference<DocumentData>;

  constructor(private _fireStore: Firestore, private _globalService: GlobalService) {
    this.specializationsCollection = collection(this._fireStore, Collections.SPECIALIZATIONS);
  }

  async fetchSpecializations() {
    try {
      const specializations = await new Promise<Specialization[]>((resolve, reject) => {
        collectionData(this.specializationsCollection, { idField: 'id'})
          .pipe(
            map((specializations: any[]) => {
              return specializations.map((item) => {
                return { 
                  ...item, 
                  createdAt: item.createdAt.toDate(),
                  updatedAt: item.updatedAt.toDate(),
                };
              });
            }),
            map((specializations: Specialization[]) => this._globalService.sortData({active: 'baseName', direction: 'asc'}, specializations as Specialization[])),
          )
          .subscribe({
            next: (specializations: Specialization[]) => {
              resolve(specializations);
            },
            error: (err: any) => {
              reject(err);
            }
          });
      });
  
      return specializations;
    } catch (e) {
      throw(e);
    }
  }
}
