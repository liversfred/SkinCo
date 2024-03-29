import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Booking } from 'src/app/models/booking-details.model';
import { Clinic } from 'src/app/models/clinic.model';
import { UserData } from 'src/app/models/user-data.model';
import { ClinicService } from 'src/app/services/clinic.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
})
export class BookingListComponent {
  @Input() userData: UserData | undefined;
  @Input() bookings: Booking[] = [];
  @Input() patientLevel: boolean = true;
  @Output() cancelBooking = new EventEmitter<Booking>;
  @Output() skipBooking = new EventEmitter<Booking>;
  @Output() requeueBooking = new EventEmitter<Booking>;
  @Output() completeBooking = new EventEmitter<Booking>
  @Output() rescheduleBooking = new EventEmitter<Booking>
  @Output() writeReview = new EventEmitter<Booking>
  
  constructor(private _clinicService: ClinicService, private _userService: UserService) { }

  onViewClinic(clinic: Clinic){
    const data = { clinic }
    this._clinicService.openClinicDetailsModal(data);
  }

  onViewPatient(patient: UserData){
    const data = { userData: patient };
    this._userService.openUserDetailsModal(data);
  }

  onCancelBooking(booking: Booking){
    this.cancelBooking.emit(booking);
  }

  onSkipBooking(booking: Booking){
    this.skipBooking.emit(booking);
  }

  onRequeueBooking(booking: Booking){
    this.requeueBooking.emit(booking);
  }

  onCompleteBooking(booking: Booking){
    this.completeBooking.emit(booking);
  }

  onRescheduleBooking(booking: Booking){
    this.rescheduleBooking.emit(booking);
  }

  onWriteReview(booking: Booking){
    this.writeReview.emit(booking);
  }
}
