import { NgModule } from '@angular/core';

import { UnauthorizedPageRoutingModule } from './unauthorized-routing.module';

import { UnauthorizedPage } from './unauthorized.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    UnauthorizedPageRoutingModule
  ],
  declarations: [UnauthorizedPage]
})
export class UnauthorizedPageModule {}
