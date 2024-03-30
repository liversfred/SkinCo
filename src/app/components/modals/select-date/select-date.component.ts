import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { BookingStatus } from 'src/app/constants/booking-status.enum';
import { Booking } from 'src/app/models/booking-details.model';
import { ClinicSchedule } from 'src/app/models/clinic-schedule.model';
import { Clinic } from 'src/app/models/clinic.model';
import { UserData } from 'src/app/models/user-data.model';
import { BookingService } from 'src/app/services/booking.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.scss'],
})
export class SelectDateComponent  implements OnInit, OnDestroy {
  @Input() data: any;
  clinic: Clinic | undefined;
  userData: UserData | undefined;
  selectedDate: Date | undefined;
  clinicSchedules: ClinicSchedule[] = [];
  currentDate: Date = new Date();
  minDate: string | undefined;
  maxDate: string | undefined;
  availableSlot: number | undefined | null;
  bookingsOnSelectedDate: Booking[] = [];
  clinicBookings: Booking[] = [];
  isCurrentDateEnabled: boolean = true;
  bookingSubs: Subscription | undefined;

  constructor(private _globalService: GlobalService, private _bookingService: BookingService) { }

  ngOnInit(): void {
    this.clinicSchedules = this.data.clinicSchedules;
    this.clinic = this.data.clinic;
    this.userData = this.data.userData;

    this.fetchClinicBookings();

    // Setup min and max date
    const currentDate = new Date()
    const minDate = new Date(currentDate.setDate(1));
    const maxDate = new Date(currentDate);
    maxDate.setMonth(maxDate.getMonth() + 4);
    maxDate.setDate(0);
    this.minDate = minDate.toISOString();
    this.maxDate = maxDate.toISOString();

    this.selectedDate = this.data.bookingdate ?? this.currentDate.toISOString();
  }

  fetchClinicBookings(){
    this.bookingSubs = this._bookingService.fetchBookingsByClinicIdAsync(this.clinic?.id!)
      .pipe(
        map((bookings: Booking[]) => {
          return bookings.filter((item) => new Date(item.bookingDate) >= this.currentDate)
        })
      )
      .subscribe(bookings => {
        this.clinicBookings = bookings
        console.log(this.clinicBookings);
      });
      
  }

  isClinicOpen = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDay();
    let open = false;
    const isSameMonth = this.currentDate.getMonth() === date.getMonth();

    if(isSameMonth && this.currentDate.getDate() > date.getDate()) return open;
    
    this.clinicSchedules.forEach(x => {
      const militaryTime = this._globalService.convertToMilitaryFormat(x.endTime);
      const endTimeDate = this._globalService.convertMilitaryToDateFormat(militaryTime);
      const currentDateHours = this.currentDate.getHours();
      const endTimeHours = endTimeDate.getHours();

      if(day === this._globalService.getDayOfWeekValue(x.dayOfWeek)) {
        open = true;

        if(isSameMonth && this.currentDate.getDate() === date.getDate() && currentDateHours >= endTimeHours) {
          open = false; 
          this.isCurrentDateEnabled = false;
        }
      }
    });

    return open;
  };

  onSelecteDateChanged(event: any){
    this.selectedDate = event.target.value;
    if(!this.selectedDate) return;
    
    this.calculateAvailableSlots();
  }

  calculateAvailableSlots(){
    this.availableSlot = null;
    this.bookingsOnSelectedDate = [];

    const clinicBookings = this.clinicBookings.filter(x => 
      new Date(x.bookingDate).getDate() === new Date(this.selectedDate!).getDate() 
      && (x.bookingStatus === BookingStatus.QUEUED || x.bookingStatus === BookingStatus.SKIPPED)
    );

    if(!clinicBookings) return;
    
    this.bookingsOnSelectedDate = clinicBookings;
    this.availableSlot = this.clinic!.dailyVisitLimit - clinicBookings.length;
  }

  dismiss(val?: any) {
    this._globalService.dismissModal(val);
  }

  done(){
    this.calculateAvailableSlots();

    if(this.availableSlot === 0) {
      this._globalService.showToast('The selected date is fully booked.');
      return;
    }

    const existingBooking = this.bookingsOnSelectedDate.find(x => x.patientId === this.userData?.id && x.bookingStatus !== BookingStatus.COMPLETED && x.bookingStatus !== BookingStatus.CANCELLED);

    if(existingBooking) {
      this._globalService.showToast('You already booked this data. Please choose a different date.');
      return;
    }

    if(this.selectedDate?.toString() === this.currentDate.toISOString() && !this.isCurrentDateEnabled) {
      this._globalService.showToast('This date is not available.');
      return;
    }

    this.dismiss(this.selectedDate);
  }
  
  ngOnDestroy(): void {
    this.bookingSubs?.unsubscribe();
  }
}
