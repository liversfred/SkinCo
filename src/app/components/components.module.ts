import { NgModule } from '@angular/core';
import { MapComponent } from './map/map.component';
import { RefresherComponent } from './refresher/refresher.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    MapComponent,
    RefresherComponent
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    MapComponent,
    RefresherComponent
  ]
})
export class ComponentsModule { }
