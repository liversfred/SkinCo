import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClinicServicesPageRoutingModule } from './clinic-services-routing.module';

import { ClinicServicesPage } from './clinic-services.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ClinicModule } from 'src/app/components/clinic/clinic.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClinicServicesPageRoutingModule,
    ComponentsModule,
    ClinicModule
  ],
  declarations: [ClinicServicesPage]
})
export class ClinicServicesPageModule {}
