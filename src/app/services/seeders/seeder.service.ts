import { Injectable } from '@angular/core';
import { RoleSeederService } from './role-seeder.service';

@Injectable({
  providedIn: 'root'
})
export class SeederService {

  constructor(private _roleSeeder: RoleSeederService) { }
  
  async seedAll(){
    console.log("SEEDER FLAG ON... PROCESSING SEED");
    await this._roleSeeder.seedData();
    return true;
  }
}
