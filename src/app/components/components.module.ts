import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MapComponent } from './map/map.component';
import { RefresherComponent } from './refresher/refresher.component';
import { SharedModule } from '../shared/shared.module';
import { DoctorCardComponent } from './cards/doctor-card/doctor-card.component';
import { BankDetailsCardComponent } from './cards/bank-details-card/bank-details-card.component';
import { ClinicServiceCardComponent } from './cards/clinic-service-card/clinic-service-card.component';
import { TruncateStringPipe } from '../pipes/truncate-string.pipe';
import { ClinicCardComponent } from './cards/clinic-card/clinic-card.component';
import { HomePatientComponent } from './home-patient/home-patient.component';
import { BookingCardComponent } from './cards/booking-card/booking-card.component';
import { FilterComponent } from './filter/filter.component';


@NgModule({
  declarations: [
    MapComponent,
    RefresherComponent,
    DoctorCardComponent,
    BankDetailsCardComponent,
    ClinicServiceCardComponent,
    BookingCardComponent,
    TruncateStringPipe,
    ClinicCardComponent,
    HomePatientComponent,
    FilterComponent
  ],
  imports: [
    SharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    MapComponent,
    RefresherComponent,
    DoctorCardComponent,
    BankDetailsCardComponent,
    ClinicServiceCardComponent,
    BookingCardComponent,
    TruncateStringPipe,
    ClinicCardComponent,
    HomePatientComponent,
    FilterComponent
  ]
})
export class ComponentsModule { }
