import { Injectable } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { CollectionReference, DocumentData, collection } from 'firebase/firestore';
import { Collections } from '../constants/collections.constants';
import { BehaviorSubject, map } from 'rxjs';
import { Role } from '../models/role.model';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private rolesCollection: CollectionReference<DocumentData>;
  private _roles = new BehaviorSubject<Role[]>([]);

  get roles() {
    return this._roles.asObservable();
  }

  constructor(private _fireStore: Firestore, private _globalService: GlobalService) {
    this.rolesCollection = collection(this._fireStore, Collections.ROLES);
  }

  async fetchRoles() {
    try {
      const roles = await new Promise<Role[]>((resolve, reject) => {
        collectionData(this.rolesCollection, { idField: 'id'})
          .pipe(
            map((roles: any[]) => {
              return roles.map((item) => {
                return { 
                  ...item, 
                  createdAt: item.createdAt.toDate(),
                  updatedAt: item.updatedAt.toDate(),
                };
              });
            }),
            map((roles: Role[]) => this._globalService.sortData({active: 'baseName', direction: 'asc'}, roles as Role[])),
          )
          .subscribe({
            next: (roles: Role[]) => {
              resolve(roles);
            },
            error: (err: any) => {
              reject(err);
            }
          });
      });
  
      this._roles.next(roles); 
      return roles;
    } catch (e) {
      throw(e);
    }
  }
}
