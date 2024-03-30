import { NgModule } from '@angular/core';
import { HomeAdminPageRoutingModule } from './home-admin-routing.module';

import { HomeAdminPage } from './home-admin.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

@NgModule({
  imports: [
    SharedModule,
    HomeAdminPageRoutingModule,
    CanvasJSAngularChartsModule
  ],
  declarations: [HomeAdminPage]
})
export class HomeAdminPageModule {}
