import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClinicServicesPage } from './clinic-services.page';

const routes: Routes = [
  {
    path: '',
    component: ClinicServicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClinicServicesPageRoutingModule {}
