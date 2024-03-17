import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from '../components.module';
import { BookingListComponent } from './booking-list/booking-list.component';



@NgModule({
  declarations: [
    BookingListComponent
  ],
  imports: [
    SharedModule,
    ComponentsModule
  ],
  exports: [
    BookingListComponent
  ]
})
export class BookingModule { }
