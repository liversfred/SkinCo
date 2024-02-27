import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { SearchLocationComponent } from './search-location/search-location.component';
import { IonicModule } from '@ionic/angular';
import { RefresherComponent } from './refresher/refresher.component';


@NgModule({
  declarations: [
    MapComponent,
    SearchLocationComponent,
    RefresherComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    MapComponent,
    SearchLocationComponent,
    RefresherComponent
  ]
})
export class ComponentsModule { }
