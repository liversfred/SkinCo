import { NgModule } from '@angular/core';
import { SearchLocationComponent } from './search-location/search-location.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddScheduleComponent } from './add-schedule/add-schedule.component';
import { SelectTimeComponent } from './select-time/select-time.component';
import { AddDoctorComponent } from './add-doctor/add-doctor.component';
import { AddBankDetailsComponent } from './add-bank-details/add-bank-details.component';



@NgModule({
  declarations: [
    SearchLocationComponent,
    AddScheduleComponent,
    SelectTimeComponent,
    AddDoctorComponent,
    AddBankDetailsComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    SearchLocationComponent,
    AddScheduleComponent,
    SelectTimeComponent,
    AddDoctorComponent,
    AddBankDetailsComponent
  ]
})
export class ModalsModule { }
