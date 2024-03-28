import { Injectable } from '@angular/core';
import { TrailService } from '../trail.service';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { UserData } from 'src/app/models/user-data.model';
import { Role } from 'src/app/models/role.model';
import { RoleService } from '../role.service';
import { Roles } from 'src/app/constants/roles.constants';
import { GenderConstants } from 'src/app/constants/gender.constants';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserSeederService {
  private roles: Role[] = [];

  constructor(
    private _authService: AuthService,
    private _trailService: TrailService, 
    private _roleService: RoleService,
    ) { }

  async seedData() {
    // Load roles
    await this.fetchRoles();
    const adminRoleId = this.roles.find(x => x.name == Roles.ADMIN)?.id;
    const staffRoleId = this.roles.find(x => x.name == Roles.STAFF)?.id;
    const patientRoleId = this.roles.find(x => x.name == Roles.PATIENT)?.id;

    if(!adminRoleId || !staffRoleId || !patientRoleId) {
      console.log("FAILED TO SEED USER DATA. Check Roles.");
      return;
    }

    const dataToSeed: UserData[] = [
      { 
        authId: null,
        person: {
          email: 'admin1@gmail.com',
          firstName: 'Admin1',
          middleName: 'Middle1',
          lastName: 'Last1',
          mobileNumber: '09593983451',
          gender: GenderConstants.MALE,
          age: 26
        },
        roleId: adminRoleId!,
        ...this._trailService.createAudit(`${ModifierActions.CREATED} User Admin1 M. Last1`), 
      },
      { 
        authId: null,
        person: {
          email: 'staff1@gmail.com',
          firstName: 'Staff1',
          middleName: 'Middle1',
          lastName: 'Last1',
          mobileNumber: '09593983451',
          gender: GenderConstants.FEMALE,
          age: 30
        },
        roleId: staffRoleId!,
        ...this._trailService.createAudit(`${ModifierActions.CREATED} User Staff1 M. Last1`), 
      },
      { 
        authId: null,
        person: {
          email: 'staff2@gmail.com',
          firstName: 'Staff2',
          middleName: 'Middle2',
          lastName: 'Last2',
          mobileNumber: '09593983452',
          gender: GenderConstants.MALE,
          age: 40
        },
        roleId: staffRoleId!,
        ...this._trailService.createAudit(`${ModifierActions.CREATED} User Staff2 M. Last2`), 
      },
      { 
        authId: null,
        person: {
          email: 'patient1@gmail.com',
          firstName: 'Patient1',
          middleName: 'Middle1',
          lastName: 'Last1',
          mobileNumber: '09593983451',
          gender: GenderConstants.FEMALE,
          age: 23
        },
        roleId: patientRoleId!,
        ...this._trailService.createAudit(`${ModifierActions.CREATED} User Patient1 M. Last1`), 
      },
      { 
        authId: null,
        person: {
          email: 'patient2@gmail.com',
          firstName: 'Patient2',
          middleName: 'Middle2',
          lastName: 'Last2',
          mobileNumber: '09593983453',
          gender: GenderConstants.MALE,
          age: 18
        },
        roleId: patientRoleId!,
        ...this._trailService.createAudit(`${ModifierActions.CREATED} User Patient2 M. Last2`), 
      },
      { 
        authId: null,
        person: {
          email: 'patient3@gmail.com',
          firstName: 'Patient3',
          middleName: 'Middle3',
          lastName: 'Last3',
          mobileNumber: '09593983454',
          gender: GenderConstants.MALE,
          age: 30
        },
        roleId: patientRoleId!,
        ...this._trailService.createAudit(`${ModifierActions.CREATED} User Patient3 M. Last3`), 
      },
      { 
        authId: null,
        person: {
          email: 'patient4@gmail.com',
          firstName: 'Patient4',
          middleName: 'Middle4',
          lastName: 'Last4',
          mobileNumber: '09593983455',
          gender: GenderConstants.MALE,
          age: 35
        },
        roleId: patientRoleId!,
        ...this._trailService.createAudit(`${ModifierActions.CREATED} User Patient4 M. Last4`), 
      },
      { 
        authId: null,
        person: {
          email: 'patient5@gmail.com',
          firstName: 'Patient5',
          middleName: 'Middle5',
          lastName: 'Last5',
          mobileNumber: '09593983457',
          gender: GenderConstants.MALE,
          age: 32
        },
        roleId: patientRoleId!,
        ...this._trailService.createAudit(`${ModifierActions.CREATED} User Patient5 M. Last5`), 
      },
      { 
        authId: null,
        person: {
          email: 'patient6@gmail.com',
          firstName: 'Patient6',
          middleName: 'Middle6',
          lastName: 'Last6',
          mobileNumber: '09593983456',
          gender: GenderConstants.MALE,
          age: 23
        },
        roleId: patientRoleId!,
        ...this._trailService.createAudit(`${ModifierActions.CREATED} User Patient6 M. Last6`), 
      },
    ];

    console.log("SEEDING USER DATA");
    dataToSeed.forEach(async (item) => {
      await this._authService.registerUser(item, environment.defaultPassword).then(() => {
        console.log(`User ${item.person.firstName} seeded successfully`);
      })
      .catch(e => {
        console.log(`Failed to save ${item.person.firstName}`);
      });
    });
  }

  private async fetchRoles(){
    this.roles = await this._roleService.fetchRoles();
  }
}
