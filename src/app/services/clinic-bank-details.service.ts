import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { Collections } from '../constants/collections.constants';
import { GlobalService } from './global.service';
import { BankDetails } from '../models/bank-details.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClinicBankDetailsService {
  private bankDetailssCollection: CollectionReference<DocumentData>;

  constructor(private _fireStore: Firestore, private _globalService: GlobalService) {
    this.bankDetailssCollection = collection(this._fireStore, Collections.BANK_DETAILS);
  }
  
  async saveBanKDetails(bankDetails: BankDetails): Promise<string>{
    try{
      const res = await addDoc(this.bankDetailssCollection, bankDetails);
      return res.id;
    }catch(e) {
      throw(e);
    }
  }

  async updateBankDetails(updatedModel: any): Promise<void> {
    try{
      const docInstance = doc(this._fireStore, Collections.BANK_DETAILS, updatedModel.id);
      await updateDoc(docInstance, updatedModel)
    }catch(e) {
      throw(e);
    }
  }

  async fetchBankDetailsList(clinicId: string): Promise<BankDetails[]> {
    try{
      let bankDetailsList = await new Promise<BankDetails[]>((resolve, reject) => {
        const collectionRef = query(
          this.bankDetailssCollection, 
          where('isActive', '==', true),
          where('clinicId', '==', clinicId)
        );
        
        return collectionData(collectionRef, { idField: 'id'})
          .pipe(
            map((bankDetailsList: any[]) => {
              return bankDetailsList.map((item) => {
                return { 
                  ...item, 
                  createdAt: item.createdAt.toDate(),
                  updatedAt: item.updatedAt.toDate(),
                };
              });
            }),
            map((bankDetailsList: BankDetails[]) => this._globalService.sortData({active: 'createdAt', direction: 'asc'}, bankDetailsList))
          )
          .subscribe({
            next: (bankDetailsList: BankDetails[]) => {
              resolve(bankDetailsList);
            },
            error: (err: any) => {
              reject(err);
            }
          });
      });
  
      return bankDetailsList;
    }catch(e) {
      throw(e);
    }
  }
}
