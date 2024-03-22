import { Component, OnDestroy } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AlertTypeEnum } from 'src/app/constants/alert-logo.enum';
import { BookingSegments } from 'src/app/constants/booking-segments.enum';
import { BookingStatus } from 'src/app/constants/booking-status.enum';
import { ColorConstants } from 'src/app/constants/color.constants';
import { FilterTypeEnum } from 'src/app/constants/filter-type.enum';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { Booking } from 'src/app/models/booking-details.model';
import { ClinicServiceData } from 'src/app/models/clinic-service-data.model';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { BookingService } from 'src/app/services/booking.service';
import { ClinicServicesService } from 'src/app/services/clinic-services.service';
import { ErrorService } from 'src/app/services/error.service';
import { GlobalService } from 'src/app/services/global.service';
import { TrailService } from 'src/app/services/trail.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home-staff',
  templateUrl: './home-staff.page.html',
  styleUrls: ['./home-staff.page.scss'],
})
export class HomeStaffPage implements ViewWillEnter, OnDestroy {
  userData: UserData | undefined;
  activeBookings: Booking[] = [];
  previousBookings: Booking[] = [];
  skippedBookings: Booking[] = [];
  filteredActiveBookings: Booking[] = [];
  filteredPreviousBookings: Booking[] = [];
  filteredSkippedBookings: Booking[] = [];
  clinicServices: ClinicServiceData[] = [];
  filterOptions: string[] = [FilterTypeEnum.DATE];
  users: UserData[] = [];
  bookingSegments: any = BookingSegments;
  selectedSegment: string = this.bookingSegments.ACTIVE_BOOKINGS;
  userDataSubs: Subscription | undefined;
  usersSubs: Subscription | undefined;
  clinicServiceSubs: Subscription | undefined;
  bookingSubs: Subscription | undefined;

  constructor(
    private _authService: AuthService, 
    private _userService: UserService,
    private _bookingService: BookingService,
    private _clinicServicesService: ClinicServicesService,
    private _trailService: TrailService,
    private _globalService: GlobalService,
    private _errorService: ErrorService
    ) { }

  async ionViewWillEnter() {
    this.fetchUsers();
    this.fetchClinicServices();

    // Load user data
    this.userDataSubs = this._authService.userData.subscribe(async userData => {
      this.userData = userData ?? undefined;

      if(!this.userData) return;

      this.fetchBookings();
    });
  }

  fetchUsers(){
    this.usersSubs = this._userService.fetchUsersAsync().subscribe(users => {
      this.users = users;
    });
  }

  fetchClinicServices() {
    this.clinicServiceSubs = this._clinicServicesService.fetchClinicServicesAsync().subscribe(clinicServices => {
      this.clinicServices = clinicServices;
    });
  }

  async fetchBookings(){
    this.bookingSubs = this._bookingService.fetchBookingsByClinicIdAsync(this.userData?.clinicId!)
      .subscribe({
        next: (bookings: Booking[]) => {
          this.activeBookings = [];
          this.previousBookings = [];
          this.skippedBookings = [];
      
          bookings.forEach(booking => {
            booking.patient = this.users.find(x => x.id === booking.patientId);
            booking.clinicServices = this.clinicServices.filter(x => booking.clinicServiceIds.includes(x.id!));
      
            if(booking.bookingStatus === BookingStatus.QUEUED){
              this.activeBookings.push(booking);
            }
            else if(booking.bookingStatus === BookingStatus.SKIPPED){
              this.skippedBookings.push(booking);
            }
            else{              
              this.previousBookings.push(booking);
            }
          });

          this.onFilterByDate(new Date());  // Get active bookings and filter by current date
          this.filteredPreviousBookings = this.previousBookings;
          this.filteredSkippedBookings = this.skippedBookings;
        },
        error: (err: any) => {
          this._errorService.handleError(err);
        }
      });
  }

  onChangeSegment(event: any){
    this.selectedSegment = event.target.value
    this.onFilterByDate(new Date());
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

  onFilterByDate(dateSelected: Date){
    const sourceArray = this.getSourceArray();

    const filteredArray = sourceArray.filter(x => {
      return this._globalService.checkIfDatesAreEqual(x.bookingDate, dateSelected);
    })

    this.setSourceArrayValue(filteredArray);
  }

  onFilterByClinic(clinicId: string){
    const sourceArray = this.getSourceArray();

    const filteredArray = sourceArray.filter(x => {
      return x.clinicId === clinicId;
    })

    this.setSourceArrayValue(filteredArray);
  }

  onCancelBooking(booking: Booking){
    this._globalService.showAlert(
      AlertTypeEnum.CONFIRM, 
      'Please state your reason',
      [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, 
        {
          text: 'Okay',
          handler: async (alertInputValues) => {
            const reason = alertInputValues[0];
            const action = `${ModifierActions.UPDATED} Booking ${booking.bookingNo}`;

            const updatedModel = {
              id: booking.id!,
              cancellationReason: reason !== '' ? reason : null,
              bookingStatus: BookingStatus.CANCELLED,
            ...this._trailService.updateAudit(action)
            };

            this.updateBooking(updatedModel);
          }
        }
      ],
      [
        {
          placeholder: 'Enter reason here',
          attributes: {
            maxlength: 500,
          },
        }
      ]
    )
  }

  async updateBooking(updatedModel: any){
    this._globalService.showLoader('Updating booking status...');

    this._bookingService.updateBooking(updatedModel)
      .then(async () => {
        this._globalService.hideLoader();
        this._globalService.showToast(`Booking has been updated..`, 3000, ColorConstants.SUCCESS);
      })
      .catch((e) => {
        this._errorService.handleError(e);
      });
  }

  onSkipBooking(booking: Booking){
    const action = `${ModifierActions.UPDATED} Booking ${booking.bookingNo}`;

    const updatedModel = {
      id: booking.id!,
      bookingStatus: BookingStatus.SKIPPED,
    ...this._trailService.updateAudit(action)
    };
    
    this.showAlert('Are you sure you want to skip the booking?', updatedModel);
  }

  onRequeueBooking(booking: Booking){
    const action = `${ModifierActions.UPDATED} Booking ${booking.bookingNo}`;

    const updatedModel = {
      id: booking.id!,
      bookingStatus: BookingStatus.QUEUED,
    ...this._trailService.updateAudit(action)
    };

    this.showAlert('Are you sure you want to re-queue the booking?', updatedModel);
  }

  onCompleteBooking(booking: Booking){
    const action = `${ModifierActions.UPDATED} Booking ${booking.bookingNo}`;

    const updatedModel = {
      id: booking.id!,
      bookingStatus: BookingStatus.COMPLETED,
    ...this._trailService.updateAudit(action)
    };

    this.showAlert('Are you sure you want to complete the booking?', updatedModel);
  }

  showAlert(message: string, updatedModel: any){
    this._globalService.showAlert(
      AlertTypeEnum.CONFIRM, message,
      [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, 
        {
          text: 'Yes',
          handler: async () => {
            this.updateBooking(updatedModel);
          }
        }
      ]
    );
  }

  onClearFilters(){
    const sourceArray = this.getSourceArray();
    this.setSourceArrayValue(sourceArray);
  }
  
  ngOnDestroy(): void {
    this.userDataSubs?.unsubscribe();
    this.usersSubs?.unsubscribe();
    this.clinicServiceSubs?.unsubscribe();
    this.bookingSubs?.unsubscribe();
  }
}
