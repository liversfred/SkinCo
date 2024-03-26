import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookingHistorySegmentsComponent } from 'src/app/components/booking/booking-history-segments/booking-history-segments.component';
import { AlertTypeEnum } from 'src/app/constants/alert-logo.enum';
import { BookingSegments } from 'src/app/constants/booking-segments.enum';
import { BookingStatus } from 'src/app/constants/booking-status.enum';
import { ColorConstants } from 'src/app/constants/color.constants';
import { FilterTypeEnum } from 'src/app/constants/filter-type.enum';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { Roles } from 'src/app/constants/roles.constants';
import { RouteConstants } from 'src/app/constants/route.constants';
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
export class HomeStaffPage implements OnInit, OnDestroy {
  userData: UserData | undefined;
  clinicServices: ClinicServiceData[] = [];
  users: UserData[] = [];
  userDataSubs: Subscription | undefined;
  usersSubs: Subscription | undefined;
  clinicServiceSubs: Subscription | undefined;
  bookingSubs: Subscription | undefined;
  bookingSegmentOptions: string[] = [BookingSegments.ACTIVE_BOOKINGS, BookingSegments.SKIPPED_BOOKINGS, BookingSegments.BOOKING_HISTORY];
  filterOptions: string[] = [FilterTypeEnum.DATE, FilterTypeEnum.STATUS, FilterTypeEnum.TODAY];
  @ViewChild(BookingHistorySegmentsComponent) bookingHistorySegmentsComponent : BookingHistorySegmentsComponent | undefined;

  constructor(
    private _authService: AuthService, 
    private _userService: UserService,
    private _bookingService: BookingService,
    private _clinicServicesService: ClinicServicesService,
    private _trailService: TrailService,
    private _globalService: GlobalService,
    private _router: Router,
    private _errorService: ErrorService
    ) { }

  ngOnInit(): void {
    this._globalService.showLoader('Page loading...');
    this.fetchUsers();
    this.fetchClinicServices();

    // Load user data
    this.userDataSubs = this._authService.userData.subscribe(userData => {
      if(!userData) return;
      if(userData.role?.name !== Roles.STAFF) this._router.navigateByUrl(RouteConstants.UNAUTHORIZED);

      this.userData = userData;
      this._globalService.hideLoader();

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
  
  fetchBookings(){
    this.bookingSubs = this._bookingService.fetchBookingsByClinicIdAsync(this.userData?.clinicId!)
      .subscribe({
        next: (bookings: Booking[]) => {
          bookings.forEach(booking => {
            booking.patient = this.users.find(x => x.id === booking.patientId);
            booking.clinicServices = this.clinicServices.filter(x => booking.clinicServiceIds.includes(x.id!));
          });

          this.bookingHistorySegmentsComponent?.loadBookings(bookings);
        },
        error: (err: any) => {
          this._errorService.handleError(err);
        }
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
  
  ngOnDestroy(): void {
    this.userDataSubs?.unsubscribe();
    this.usersSubs?.unsubscribe();
    this.clinicServiceSubs?.unsubscribe();
    this.bookingSubs?.unsubscribe();
  }
}
