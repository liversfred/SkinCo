import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BookingSegments } from 'src/app/constants/booking-segments.enum';
import { BookingStatus } from 'src/app/constants/booking-status.enum';
import { FilterTypeEnum } from 'src/app/constants/filter-type.enum';
import { Booking } from 'src/app/models/booking-details.model';
import { Clinic } from 'src/app/models/clinic.model';
import { UserData } from 'src/app/models/user-data.model';
import { BookingService } from 'src/app/services/booking.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-booking-history-segments',
  templateUrl: './booking-history-segments.component.html',
  styleUrls: ['./booking-history-segments.component.scss'],
})
export class BookingHistorySegmentsComponent {
  @Input() userData: UserData | undefined;
  @Input() patientLevel: boolean = true;
  @Input() bookingSegmentOptions: string[] = [];
  @Input() filterOptions: string[] = [];
  @Input() clinicOptions: Clinic[] = [];
  activeBookings: Booking[] = [];
  skippedBookings: Booking[] = [];
  previousBookings: Booking[] = [];
  filteredActiveBookings: Booking[] = [];
  filteredSkippedBookings: Booking[] = [];
  filteredPreviousBookings: Booking[] = [];
  bookingSegments: any = BookingSegments;
  selectedSegment: string = this.bookingSegments.ACTIVE_BOOKINGS;
  currentFilter: FilterTypeEnum | null = FilterTypeEnum.TODAY;
  currentClinicFilter: Clinic | undefined;
  currentDateFilter: Date | undefined;
  currentBookingStatusFilter: string | undefined;
  filterMessage: string | undefined;
  @Output() cancelBooking = new EventEmitter<Booking>;
  @Output() skipBooking = new EventEmitter<Booking>;
  @Output() requeueBooking = new EventEmitter<Booking>;
  @Output() completeBooking = new EventEmitter<Booking>;
  @Output() rescheduleBooking = new EventEmitter<Booking>;

  constructor(
    private _globalService: GlobalService,
    private _bookingService: BookingService
    ) { }
  
  loadBookings(bookings: Booking[]){
    this.activeBookings = [];
    this.previousBookings = [];
    this.skippedBookings = [];
    let forStatusUpdate: Booking[] = [];

    bookings.forEach(booking => {
      const daysDifference = this._globalService.getDatesDifference(booking.bookingDate, new Date());
      if(daysDifference < 0 && booking.bookingStatus !== BookingStatus.EXPIRED){
        forStatusUpdate.push(booking);
      }

      if(booking.bookingStatus === BookingStatus.QUEUED || (booking.bookingStatus === BookingStatus.SKIPPED && this.patientLevel)){
        this.activeBookings.push(booking);
      }
      else if(booking.bookingStatus === BookingStatus.SKIPPED){
        this.skippedBookings.push(booking);
      }
      else{              
        this.previousBookings.push(booking);
      }
    });
    
    this.filteredActiveBookings = this.activeBookings;
    this.filteredPreviousBookings = this.previousBookings;
    this.filteredSkippedBookings = this.skippedBookings;
    this.runFilter(); 
    this.updateBookingStatus(forStatusUpdate);    // Update the status to expired if the date is past the booking date
  }

  updateBookingStatus(bookings: Booking[]){
    bookings.forEach(booking => {
      const updatedModel = {
        id: booking.id,
        bookingStatus: BookingStatus.EXPIRED
      }

      this._bookingService.updateBooking(updatedModel);
    })
  }

  runFilter(){
    if(this.showAll()) {
      this.onClearFilters();
    }
    
    if(this.currentFilter === FilterTypeEnum.TODAY) this.onFilterByDate(new Date());
    else if(this.currentFilter === FilterTypeEnum.DATE && this.currentDateFilter) this.onFilterByDate(this.currentDateFilter);
    else if(this.currentFilter === FilterTypeEnum.CLINIC && this.currentClinicFilter) this.onFilterByClinic(this.currentClinicFilter);
  }

  onChangeSegment(segment: any){
    this.selectedSegment = segment;

    if(!this.showAll()) this.currentFilter = FilterTypeEnum.TODAY;
    this.runFilter();
  }

  getSourceArray(): Booking[]{
    return this.selectedSegment === BookingSegments.ACTIVE_BOOKINGS ? this.activeBookings : 
            this.selectedSegment === BookingSegments.SKIPPED_BOOKINGS ? this.skippedBookings : this.previousBookings; 
  }

  setSourceArrayValue(bookings: Booking[]){
    if(this.selectedSegment === BookingSegments.ACTIVE_BOOKINGS){
      this.filteredActiveBookings = bookings;
    }
    else if(this.selectedSegment === BookingSegments.SKIPPED_BOOKINGS){
      this.filteredSkippedBookings = bookings;
    }
    else{
      this.filteredPreviousBookings = bookings;
    }
  }

  showAll(){
    return this.selectedSegment === BookingSegments.BOOKING_HISTORY;
  }

  onFilterByDate(dateSelected: Date){
    this.currentFilter = FilterTypeEnum.DATE
    this.currentDateFilter = dateSelected;

    if(this._globalService.checkIfDatesAreEqual(dateSelected, new Date())){
      this.filterMessage = "Today";
    }
    else{
      this.filterMessage = `${this.currentFilter} | ${this.currentDateFilter.toLocaleDateString()}`;
    }

    const sourceArray = this.getSourceArray();

    const filteredArray = sourceArray.filter(x => {
      return this._globalService.checkIfDatesAreEqual(x.bookingDate, dateSelected);
    })

    this.setSourceArrayValue(filteredArray);
  }

  onFilterByClinic(clinic: Clinic){
    this.currentFilter = FilterTypeEnum.CLINIC
    this.currentClinicFilter = clinic;
    this.filterMessage = `${this.currentFilter} | ${clinic.name}`;

    const sourceArray = this.getSourceArray();

    const filteredArray = sourceArray.filter(x => {
      return x.clinicId === clinic.id;
    })

    this.setSourceArrayValue(filteredArray);
  }

  onFilterByStatus(bookingStatus: BookingStatus){
    this.currentFilter = FilterTypeEnum.STATUS
    this.currentBookingStatusFilter = bookingStatus;
    this.filterMessage = `${this.currentFilter} | ${this.currentBookingStatusFilter}`;

    const sourceArray = this.getSourceArray();

    const filteredArray = sourceArray.filter(x => {
      return x.bookingStatus === bookingStatus;
    });

    this.setSourceArrayValue(filteredArray);
  }

  onClearFilters(){
    this.currentFilter = null;
    this.filterMessage = `None`;

    const sourceArray = this.getSourceArray();
    this.setSourceArrayValue(sourceArray);
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
}
