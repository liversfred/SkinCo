import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClinicBankDetailsPage } from './clinic-bank-details.page';

const routes: Routes = [
  {
    path: '',
    component: ClinicBankDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClinicBankDetailsPageRoutingModule {}
