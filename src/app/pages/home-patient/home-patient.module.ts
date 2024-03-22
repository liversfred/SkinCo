import { NgModule } from '@angular/core';

import { HomePatientPageRoutingModule } from './home-patient-routing.module';

import { HomePatientPage } from './home-patient.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    HomePatientPageRoutingModule
  ],
  declarations: [HomePatientPage]
})
export class HomePatientPageModule {}
