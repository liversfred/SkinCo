import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePatientPage } from './home-patient.page';

const routes: Routes = [
  {
    path: '',
    component: HomePatientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePatientPageRoutingModule {}
