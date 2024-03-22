import { NgModule } from '@angular/core';
import { HomeStaffPageRoutingModule } from './home-staff-routing.module';

import { HomeStaffPage } from './home-staff.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BookingModule } from 'src/app/components/booking/booking.module';
import { ProfileModule } from 'src/app/components/profile/profile.module';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    BookingModule,
    ProfileModule,
    HomeStaffPageRoutingModule
  ],
  declarations: [HomeStaffPage]
})
export class HomeStaffPageModule {}
