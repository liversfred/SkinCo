import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { UserData } from '../models/user-data.model';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Collections } from '../constants/collections.constants';
import { StorageService } from './storage.service';
import { BehaviorSubject, map } from 'rxjs';
import { Router } from '@angular/router';
import { RouteConstants } from '../constants/route.constants';
import { RoleService } from './role.service';
import { StorageKeys } from '../constants/storage-key.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: CollectionReference<DocumentData>;
  private _userData = new BehaviorSubject<UserData | null>(null);

  get userData() {
    return this._userData.asObservable();
  }

  constructor(private _fireStore: Firestore, private _auth: Auth, private _storageService: StorageService, private _router: Router, private _roleService: RoleService) { 
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
      
      if(!response.user) return;

      this.storeAuthId(response.user.uid);
      await this.fetchUserData();
    } catch(e) {
      throw(e);
    }
  }
  
  async checkUserAuth() {
    try {
      const user = await this.getAuthState();
      return user != null;
    } catch(e) {
      throw(e);
    }
  }
  
  private async getAuthState(): Promise<any> {
    return new Promise((resolve) => {
      onAuthStateChanged(this._auth, user => {
        if(user) this.storeAuthId(user.uid);
        resolve(user)
      });
    });
  }

  async fetchUserData() {
    try {
      // Get auth id from local storage
      const authId = await this.getAuthId();
      
      const collectionRef = query(this.usersCollection, where('authId', '==', authId));
      let userData = await new Promise<UserData>((resolve, reject) => {
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
      
      // Fetch and assign role object
      const roles = await this._roleService.fetchRoles();
      userData = {
        ...userData,
        role: roles.find(x => x.id == userData.roleId)
      } 
  
      this._userData.next(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  async logout(){
    signOut(this._auth);
    // Set userdata to null
    this._userData.next(null);
    // Clear local storage
    this._storageService.clearStorage();
    // Reload page
    window.location.reload();
  }

  storeAuthId(authId: string) {
    this._storageService.setStorage(StorageKeys.AUTHID, authId);
  }

  async getAuthId(): Promise<string | null>{
    const storedAuthId = await this._storageService.getStorage(StorageKeys.AUTHID);
    return storedAuthId.value
  }

  redirectIfLoggedIn() {
    this._router.navigate([RouteConstants.HOME]);
  }
}
