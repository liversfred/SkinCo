import { NgModule } from '@angular/core';
import { SearchLocationComponent } from './search-location/search-location.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddScheduleComponent } from './add-schedule/add-schedule.component';
import { SelectTimeComponent } from './select-time/select-time.component';
import { AddDoctorComponent } from './add-doctor/add-doctor.component';
import { AddBankDetailsComponent } from './add-bank-details/add-bank-details.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { AddClinicServiceComponent } from './add-clinic-service/add-clinic-service.component';
import { GenericComponent } from './generic/generic.component';
import { BookingComponent } from './booking/booking.component';
import { SelectDateComponent } from './select-date/select-date.component';
import { AddReviewComponent } from './add-review/add-review.component';
import { AddCommentComponent } from './add-comment/add-comment.component';



@NgModule({
  declarations: [
    SearchLocationComponent,
    AddScheduleComponent,
    SelectTimeComponent,
    SelectDateComponent,
    AddDoctorComponent,
    AddBankDetailsComponent,
    UpdateProfileComponent,
    AddClinicServiceComponent,
    GenericComponent,
    BookingComponent,
    AddReviewComponent,
    AddCommentComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    SearchLocationComponent,
    AddScheduleComponent,
    SelectTimeComponent,
    SelectDateComponent,
    AddDoctorComponent,
    AddBankDetailsComponent,
    UpdateProfileComponent,
    AddClinicServiceComponent,
    GenericComponent,
    BookingComponent,
    AddReviewComponent,
    AddCommentComponent
  ]
})
export class ModalsModule { }
