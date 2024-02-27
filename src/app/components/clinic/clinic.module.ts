import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicRegistrationFormComponent } from './clinic-registration-form/clinic-registration-form.component';
import { ClinicInfoComponent } from './clinic-info/clinic-info.component';
import { LocationDetailsComponent } from './location-details/location-details.component';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ClinicAccordionComponent } from './clinic-accordion/clinic-accordion.component';



@NgModule({
  declarations: [
    ClinicRegistrationFormComponent,
    ClinicInfoComponent,
    LocationDetailsComponent,
    ClinicAccordionComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  exports: [
    ClinicRegistrationFormComponent,
    ClinicInfoComponent,
    LocationDetailsComponent,
    ClinicAccordionComponent
  ]
})
export class ClinicModule { }
