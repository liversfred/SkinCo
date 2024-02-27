import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageClinicsPageRoutingModule } from './manage-clinics-routing.module';

import { ManageClinicsPage } from './manage-clinics.page';
import { ClinicModule } from 'src/app/components/clinic/clinic.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageClinicsPageRoutingModule,
    ComponentsModule,
    ClinicModule
  ],
  declarations: [ManageClinicsPage]
})
export class ManageClinicsPageModule {}
