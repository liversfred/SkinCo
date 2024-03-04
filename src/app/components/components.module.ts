import { NgModule } from '@angular/core';
import { MapComponent } from './map/map.component';
import { RefresherComponent } from './refresher/refresher.component';
import { SharedModule } from '../shared/shared.module';
import { DoctorCardComponent } from './doctor-card/doctor-card.component';


@NgModule({
  declarations: [
    MapComponent,
    RefresherComponent,
    DoctorCardComponent
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    MapComponent,
    RefresherComponent,
    DoctorCardComponent
  ]
})
export class ComponentsModule { }
