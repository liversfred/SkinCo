import { Injectable } from '@angular/core';
import { RoleSeederService } from './role-seeder.service';
import { ClinicSeederService } from './clinic-seeder.service';
import { SpecializationSeederService } from './specialization-seeder.service';
import { UserSeederService } from './user-seeder.service';

@Injectable({
  providedIn: 'root'
})
export class SeederService {

  constructor(
    private _roleSeeder: RoleSeederService,
    private _clinicSeeder: ClinicSeederService,
    private _specializationSeeder: SpecializationSeederService,
    private _userSeeder: UserSeederService
    ) { }
  
  async seedAll(){
    console.log("SEEDER FLAG ON... PROCESSING SEED");
    await this._roleSeeder.seedData();
    await this._clinicSeeder.seedData();
    await this._specializationSeeder.seedData();
    await this._userSeeder.seedData();
    return true;
  }
}
