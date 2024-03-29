import { NgModule } from '@angular/core';
import { ClinicRegistrationFormComponent } from './clinic-registration-form/clinic-registration-form.component';
import { ClinicInfoComponent } from './clinic-info/clinic-info.component';
import { ComponentsModule } from '../components.module';
import { ClinicAccordionComponent } from './clinic-accordion/clinic-accordion.component';
import { ClinicScheduleComponent } from './clinic-schedule/clinic-schedule.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClinicScheduleListComponent } from './clinic-schedule-list/clinic-schedule-list.component';
import { ClinicDoctorsComponent } from './clinic-doctors/clinic-doctors.component';
import { ClinicDetailsComponent } from './clinic-details/clinic-details.component';
import { ClinicReviewsComponent } from './clinic-reviews/clinic-reviews.component';



@NgModule({
  declarations: [
    ClinicRegistrationFormComponent,
    ClinicDetailsComponent,
    ClinicInfoComponent,
    ClinicAccordionComponent,
    ClinicScheduleComponent,
    ClinicScheduleListComponent,
    ClinicDoctorsComponent,
    ClinicReviewsComponent
  ],
  imports: [
    SharedModule,
    ComponentsModule
  ],
  exports: [
    ClinicRegistrationFormComponent,
    ClinicDetailsComponent,
    ClinicInfoComponent,
    ClinicAccordionComponent,
    ClinicScheduleComponent,
    ClinicScheduleListComponent,
    ClinicDoctorsComponent,
    ClinicReviewsComponent
  ]
})
export class ClinicModule { }
