import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { SearchLocationComponent } from './search-location/search-location.component';
import { IonicModule } from '@ionic/angular';
import { ClinicRegistrationFormComponent } from './clinic-registration-form/clinic-registration-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MapComponent,
    SearchLocationComponent,
    ClinicRegistrationFormComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [
    MapComponent,
    SearchLocationComponent,
    ClinicRegistrationFormComponent
  ]
})
export class ComponentsModule { }
