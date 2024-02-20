import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { UserData } from '../models/user-data.model';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Collections } from '../constants/collections.constants';
import { StorageService } from './storage.service';
import { map } from 'rxjs';
import { StorageKeys } from '../constants/storage-key.constants';
import { Router } from '@angular/router';
import { RoutesConstants } from '../constants/routes.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: CollectionReference<DocumentData>;

  constructor(private _fireStore: Firestore, private _auth: Auth, private _storageService: StorageService, private _router: Router) { 
    this.usersCollection = collection(this._fireStore, Collections.USERS);
  }

  async registerUser(userData: UserData, password: string) {
    try{
      const registeredUser = await createUserWithEmailAndPassword(this._auth, userData.person.email, password);
      userData = {
        ...userData,
        authId: registeredUser.user.uid,
      }
      await addDoc(this.usersCollection, userData)
    }catch(e) {
      throw(e);
    }
  }

  async login(email: string, password: string){
    try {
      const response = await signInWithEmailAndPassword(this._auth, email, password);

      if(response.user) await this.fetchUserData(response.user.uid);
    } catch(e) {
      throw(e);
    }
  }

  async getUserData(): Promise<UserData | null> {
    try {
      const userDataString = await this._storageService.getStorage(StorageKeys.USERDATA);
      if(!userDataString.value) return null;
      
      const userData: UserData = JSON.parse(userDataString.value) as UserData;
      return userData;
    } catch (error) {
      console.error(`Error getting the user data from storage: ${error}`);
      throw error;
    }
  }

  async isUserLoggedIn(): Promise<boolean>{
    try {
      const userData = await this.getUserData();

      // Navigate if logged in
      if(userData) {
        this._router.navigate([RoutesConstants.HOME]);
        return true;
      }

      return false;
    } catch(e) {
      throw(e);
    }
  }

  private async fetchUserData(authId: string) {
    try {
      const collectionRef = query(this.usersCollection, where('authId', '==', authId));
      const userData = await new Promise<UserData>((resolve, reject) => {
        collectionData(collectionRef, { idField: 'id'})
          .pipe(
            map((users: any) => {
              const firstRes = users[0];
              const userData: UserData = {
                ...firstRes,
                  createdAt: firstRes.createdAt.toDate(),
                  updatedAt: firstRes.updatedAt.toDate(),
              }
              return userData;
            }),
          )
          .subscribe({
            next: (userData: UserData) => {
              resolve(userData);
            },
            error: (err: any) => {
              reject(err);
            }
          });
      });
  
      this._storageService.setStorage(StorageKeys.USERDATA, JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }
}
