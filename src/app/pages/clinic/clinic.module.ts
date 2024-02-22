import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClinicPageRoutingModule } from './clinic-routing.module';

import { ClinicPage } from './clinic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClinicPageRoutingModule
  ],
  declarations: [ClinicPage]
})
export class ClinicPageModule {}
