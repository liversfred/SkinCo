import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from '../components.module';
import { BookingListComponent } from './booking-list/booking-list.component';
import { BookingHistorySegmentsComponent } from './booking-history-segments/booking-history-segments.component';



@NgModule({
  declarations: [
    BookingHistorySegmentsComponent,
    BookingListComponent
  ],
  imports: [
    SharedModule,
    ComponentsModule
  ],
  exports: [
    BookingHistorySegmentsComponent,
    BookingListComponent
  ]
})
export class BookingModule { }
