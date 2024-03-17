import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingHistoryPageRoutingModule } from './booking-history-routing.module';

import { BookingHistoryPage } from './booking-history.page';
import { BookingModule } from 'src/app/components/booking/booking.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingHistoryPageRoutingModule,
    BookingModule,
    ComponentsModule
  ],
  declarations: [BookingHistoryPage]
})
export class BookingHistoryPageModule {}
