import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClinicPageRoutingModule } from './clinic-routing.module';

import { ClinicPage } from './clinic.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ClinicModule } from 'src/app/components/clinic/clinic.module';
import { ModalsModule } from 'src/app/components/modals/modals.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClinicPageRoutingModule,
    ComponentsModule,
    ClinicModule,
    ModalsModule
  ],
  declarations: [ClinicPage]
})
export class ClinicPageModule {}
