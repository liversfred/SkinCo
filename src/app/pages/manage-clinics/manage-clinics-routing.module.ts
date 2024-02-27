import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageClinicsPage } from './manage-clinics.page';

const routes: Routes = [
  {
    path: '',
    component: ManageClinicsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageClinicsPageRoutingModule {}
