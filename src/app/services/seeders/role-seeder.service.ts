import { Injectable } from '@angular/core';
import { Roles } from 'src/app/constants/roles.constants';
import { Role } from 'src/app/models/role.model';
import { TrailService } from '../trail.service';
import { CollectionReference, DocumentData, Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Collections } from 'src/app/constants/collections.constants';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { PermissionConstants } from 'src/app/constants/permission.constants';

@Injectable({
  providedIn: 'root'
})
export class RoleSeederService {
  private collection: CollectionReference<DocumentData>;

  constructor(private _fireStore: Firestore, private _trailService: TrailService) {
    this.collection = collection(this._fireStore, Collections.ROLES);
  }

  async seedData() {
    const dataToSeed: Role[] = [
      { 
        name: Roles.ADMIN,  ...this._trailService.createAudit(`${ModifierActions.CREATED} Role ${Roles.ADMIN}`), 
        permissions: [
          { name: PermissionConstants.HOME, ...this._trailService.createAudit(`${ModifierActions.CREATED} Permission ${PermissionConstants.HOME}`) },
        ]
      },
      { 
        name: Roles.STAFF,  ...this._trailService.createAudit(`${ModifierActions.CREATED} Role ${Roles.STAFF}`), 
        permissions: [
          { name: PermissionConstants.HOME, ...this._trailService.createAudit(`${ModifierActions.CREATED} Permission ${PermissionConstants.HOME}`) },
        ]
      },
      { 
        name: Roles.PATIENT,  ...this._trailService.createAudit(`${ModifierActions.CREATED} Role ${Roles.PATIENT}`), 
        permissions: [
          { name: PermissionConstants.HOME, ...this._trailService.createAudit(`${ModifierActions.CREATED} Permission ${PermissionConstants.HOME}`) },
        ]
      },
    ];

    console.log("SEEDING ROLES DATA");
    dataToSeed.forEach(async (item) => {
      await addDoc(this.collection, item)
        .then(() => console.log('Role seeded successfully'))
        .catch(error => console.error('Error seeding data', error));
    });
  }
}
