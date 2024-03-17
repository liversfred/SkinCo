import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookingStatus } from 'src/app/constants/booking-status.enum';
import { ColorConstants } from 'src/app/constants/color.constants';
import { Booking } from 'src/app/models/booking-details.model';
import { Clinic } from 'src/app/models/clinic.model';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss'],
})
export class BookingCardComponent  implements OnInit {
  @Input() booking: Booking | undefined;
  totalServicesPrice: number = 0;
  statusColor: ColorConstants | null | undefined;
  @Output() viewClinic = new EventEmitter<Clinic>

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

  onViewClinic(){
    this.viewClinic.emit(this.booking?.clinic);
  }
}
