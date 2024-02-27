import { Injectable } from '@angular/core';
import { RoleSeederService } from './role-seeder.service';
import { ClinicSeederService } from './clinic-seeder.service';

@Injectable({
  providedIn: 'root'
})
export class SeederService {

  constructor(
    private _roleSeeder: RoleSeederService,
    private _clinicSeeder: ClinicSeederService
    ) { }
  
  async seedAll(){
    console.log("SEEDER FLAG ON... PROCESSING SEED");
    await this._roleSeeder.seedData();
    await this._clinicSeeder.seedData();
    return true;
  }
}
