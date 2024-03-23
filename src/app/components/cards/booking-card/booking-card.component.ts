import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonPopover } from '@ionic/angular';
import { BookingStatus } from 'src/app/constants/booking-status.enum';
import { ColorConstants } from 'src/app/constants/color.constants';
import { Roles } from 'src/app/constants/roles.constants';
import { Booking } from 'src/app/models/booking-details.model';
import { Clinic } from 'src/app/models/clinic.model';
import { UserData } from 'src/app/models/user-data.model';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss'],
})
export class BookingCardComponent  implements OnInit {
  @Input() booking: Booking | undefined;
  @Input() userData: UserData | undefined;
  @Input() patientLevel: boolean = true;
  roles: any = Roles;
  bookingStatuses: any = BookingStatus;
  totalServicesPrice: number = 0;
  statusColor: ColorConstants | null | undefined;
  isPopoverOpen = false;
  @ViewChild('popover') popover: IonPopover | undefined;
  @Output() viewClinic = new EventEmitter<Clinic>;
  @Output() viewPatient = new EventEmitter<UserData>;
  @Output() cancelBooking = new EventEmitter<Booking>;
  @Output() skipBooking = new EventEmitter<Booking>;
  @Output() requeueBooking = new EventEmitter<Booking>
  @Output() completeBooking = new EventEmitter<Booking>
  @Output() rescheduleBooking = new EventEmitter<Booking>

  constructor() { }

  ngOnInit() {
    this.statusColor = this.getStatusColor(this.booking?.bookingStatus!);

    this.calculateTotalServicesPrice();
  }

  getStatusColor(bookingStatus: BookingStatus): ColorConstants | null{
    switch (bookingStatus) {
      case BookingStatus.QUEUED:
        return ColorConstants.SECONDARY;
      case BookingStatus.COMPLETED:
        return ColorConstants.SUCCESS;
      case BookingStatus.SKIPPED:
        return ColorConstants.DANGER;
      case BookingStatus.CANCELLED:
      case BookingStatus.EXPIRED:
        return ColorConstants.DANGER;
      default:
        return null;
    }
  }
  
  calculateTotalServicesPrice(){
    this.totalServicesPrice = 0;
    this.booking?.clinicServices?.forEach(clinicService => {
      this.totalServicesPrice += clinicService.price;
    });
  }

  presentPopover(e: Event) {
    this.popover!.event = e;
    this.isPopoverOpen = true;
  }

  onViewClinic(){
    this.viewClinic.emit(this.booking?.clinic);
  }

  onViewPatient(){
    this.viewPatient.emit(this.booking?.patient);
  }

  onCancelBooking(){
    this.isPopoverOpen = false;
    this.cancelBooking.emit(this.booking);
  }

  onSkipBooking(){
    this.isPopoverOpen = false;
    this.skipBooking.emit(this.booking);
  }

  onRequeueBooking(){
    this.isPopoverOpen = false;
    this.requeueBooking.emit(this.booking);
  }

  onCompleteBooking(){
    this.isPopoverOpen = false;
    this.completeBooking.emit(this.booking);
  }

  onRescheduleBooking(){
    this.isPopoverOpen = false;
    this.rescheduleBooking.emit(this.booking);
  }
}
