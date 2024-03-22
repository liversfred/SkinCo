import { NgModule } from '@angular/core';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { ProfileModule } from 'src/app/components/profile/profile.module';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    ProfileModule,
    ProfilePageRoutingModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
