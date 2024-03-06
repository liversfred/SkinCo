import { NgModule } from '@angular/core';
import { ClinicRegistrationFormComponent } from './clinic-registration-form/clinic-registration-form.component';
import { ClinicInfoComponent } from './clinic-info/clinic-info.component';
import { LocationDetailsComponent } from './location-details/location-details.component';
import { ComponentsModule } from '../components.module';
import { ClinicAccordionComponent } from './clinic-accordion/clinic-accordion.component';
import { ClinicScheduleComponent } from './clinic-schedule/clinic-schedule.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClinicService } from 'src/app/services/clinic.service';
import { ClinicScheduleService } from 'src/app/services/clinic-schedule.service';
import { ClinicScheduleListComponent } from './clinic-schedule-list/clinic-schedule-list.component';
import { ClinicDoctorsComponent } from './clinic-doctors/clinic-doctors.component';



@NgModule({
  declarations: [
    ClinicRegistrationFormComponent,
    ClinicInfoComponent,
    LocationDetailsComponent,
    ClinicAccordionComponent,
    ClinicScheduleComponent,
    ClinicScheduleListComponent,
    ClinicDoctorsComponent,
  ],
  imports: [
    SharedModule,
    ComponentsModule
  ],
  exports: [
    ClinicRegistrationFormComponent,
    ClinicInfoComponent,
    LocationDetailsComponent,
    ClinicAccordionComponent,
    ClinicScheduleComponent,
    ClinicScheduleListComponent,
    ClinicDoctorsComponent,
  ],
  providers: [ClinicService, ClinicScheduleService]
})
export class ClinicModule { }
