import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Booking } from 'src/app/models/booking-details.model';
import { Clinic } from 'src/app/models/clinic.model';
import { UserData } from 'src/app/models/user-data.model';
import { ClinicService } from 'src/app/services/clinic.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
})
export class BookingListComponent {
  @Input() userData: UserData | undefined;
  @Input() bookings: Booking[] = [];
  @Output() cancelBooking = new EventEmitter<Booking>
  
  constructor(private _clinicService: ClinicService) { }

  onViewClinic(clinic: Clinic){
    const data = { clinic }
    this._clinicService.openClinicDetailsModal(data);
  }

  onCancelBooking(booking: Booking){
    this.cancelBooking.emit(booking);
  }
}
