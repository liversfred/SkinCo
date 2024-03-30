import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, collection, collectionData, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { Collections } from '../constants/collections.constants';
import { Observable, map } from 'rxjs';
import { UserData } from '../models/user-data.model';
import { GlobalService } from './global.service';
import { ErrorService } from './error.service';
import { ProfileDetailsComponent } from '../components/profile/profile-details/profile-details.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection: CollectionReference<DocumentData>;

  constructor(private _fireStore: Firestore, private _globalService: GlobalService, private _errorService: ErrorService) { 
    this.usersCollection = collection(this._fireStore, Collections.USERS);
  }

  fetchUsersAsync(): Observable<UserData[]> {
    const collectionRef = query(this.usersCollection, where('isActive', '==', true));
    return collectionData(collectionRef, { idField: 'id'})
      .pipe(
        map((users: any[]) => {
          return users.map((item) => {
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
        map((users: UserData[]) => this._globalService.sortData({active: 'fullName', direction: 'asc'}, users))
      );
  }

  async fetchUserData(authId: string | null): Promise<UserData> {
    try {
      const collectionRef = query(this.usersCollection, where('authId', '==', authId));
      let userData = await new Promise<UserData>((resolve, reject) => {
        collectionData(collectionRef, { idField: 'id'})
          .pipe(
            map((users: any) => {
              if(!users) reject(null);
              const firstRes = users[0];
              
              const userData: UserData = {
                ...firstRes,
                  createdAt: firstRes.createdAt.toDate(),
                  updatedAt: firstRes.updatedAt.toDate(),
                  person: {
                    ...firstRes.person,
                    fullName: this._globalService.formatFullName(firstRes.person.firstName, firstRes.person.middleName, firstRes.person.lastName)
                  }
              }
              return userData;
            }),
          )
          .subscribe({
            next: (userData: UserData) => {
              resolve(userData);
            },
            error: (err: any) => {
              console.log(err);
              reject(null);
            }
          });
      });

      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }
  
  async openUserDetailsModal(data?: any) {
    try {
      const options = {
        component: ProfileDetailsComponent,
        swipeToClose: false,
        canDismiss: true,
        backdropDismiss: true,
        componentProps: { data },
      };
      
      await this._globalService.createModal(options);
    } catch(e) {
      this._errorService.handleError(e);
    }
  }

  async updateUserData(updatedModel: any): Promise<void> {
    try{
      const docInstance = doc(this._fireStore, Collections.USERS, updatedModel.id);
      await updateDoc(docInstance, updatedModel)
    }catch(e) {
      throw(e);
    }
  }
}
