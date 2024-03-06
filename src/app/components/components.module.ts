import { NgModule } from '@angular/core';
import { MapComponent } from './map/map.component';
import { RefresherComponent } from './refresher/refresher.component';
import { SharedModule } from '../shared/shared.module';
import { DoctorCardComponent } from './cards/doctor-card/doctor-card.component';
import { BankDetailsCardComponent } from './cards/bank-details-card/bank-details-card.component';
import { ClinicServiceCardComponent } from './cards/clinic-service-card/clinic-service-card.component';
import { TruncateStringPipe } from '../pipes/truncate-string.pipe';


@NgModule({
  declarations: [
    MapComponent,
    RefresherComponent,
    DoctorCardComponent,
    BankDetailsCardComponent,
    ClinicServiceCardComponent,
    TruncateStringPipe
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    MapComponent,
    RefresherComponent,
    DoctorCardComponent,
    BankDetailsCardComponent,
    ClinicServiceCardComponent,
    TruncateStringPipe
  ]
})
export class ComponentsModule { }
