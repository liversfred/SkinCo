import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClinicBankDetailsPageRoutingModule } from './clinic-bank-details-routing.module';

import { ClinicBankDetailsPage } from './clinic-bank-details.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ClinicModule } from 'src/app/components/clinic/clinic.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClinicBankDetailsPageRoutingModule,
    ComponentsModule,
    ClinicModule
  ],
  declarations: [ClinicBankDetailsPage]
})
export class ClinicBankDetailsPageModule {}
