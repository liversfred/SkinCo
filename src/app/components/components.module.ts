import { NgModule } from '@angular/core';
import { MapComponent } from './map/map.component';
import { RefresherComponent } from './refresher/refresher.component';
import { SharedModule } from '../shared/shared.module';
import { DoctorCardComponent } from './cards/doctor-card/doctor-card.component';
import { BankDetailsCardComponent } from './cards/bank-details-card/bank-details-card.component';


@NgModule({
  declarations: [
    MapComponent,
    RefresherComponent,
    DoctorCardComponent,
    BankDetailsCardComponent
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    MapComponent,
    RefresherComponent,
    DoctorCardComponent,
    BankDetailsCardComponent
  ]
})
export class ComponentsModule { }
