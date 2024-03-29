import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ViewDidLeave } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { BookingHistorySegmentsComponent } from 'src/app/components/booking/booking-history-segments/booking-history-segments.component';
import { AddReviewComponent } from 'src/app/components/modals/add-review/add-review.component';
import { BookingComponent } from 'src/app/components/modals/booking/booking.component';
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
import { Clinic } from 'src/app/models/clinic.model';
import { Review } from 'src/app/models/review.model';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { BookingService } from 'src/app/services/booking.service';
import { ClinicServicesService } from 'src/app/services/clinic-services.service';
import { ClinicService } from 'src/app/services/clinic.service';
import { EmailService } from 'src/app/services/email.service';
import { ErrorService } from 'src/app/services/error.service';
import { GlobalService } from 'src/app/services/global.service';
import { TrailService } from 'src/app/services/trail.service';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.page.html',
  styleUrls: ['./booking-history.page.scss'],
})
export class BookingHistoryPage implements OnInit, ViewDidLeave, OnDestroy {
  userData: UserData | undefined;
  clinics: Clinic[] = [];
  clinicServices: ClinicServiceData[] = [];
  clinicOptions: Clinic[] = [];
  userDataSubs: Subscription | undefined;
  clinicSubs: Subscription | undefined;
  clinicServiceSubs: Subscription | undefined;
  bookingSubs: Subscription | undefined;
  filterOptions: string[] = [FilterTypeEnum.DATE, FilterTypeEnum.TODAY, FilterTypeEnum.CLINIC, FilterTypeEnum.STATUS];
  bookingSegmentOptions: string[] = [BookingSegments.ACTIVE_BOOKINGS, BookingSegments.BOOKING_HISTORY];
  @ViewChild(BookingHistorySegmentsComponent) bookingHistorySegmentsComponent : BookingHistorySegmentsComponent | undefined;

  constructor(
    private _authService: AuthService, 
    private _bookingService: BookingService,
    private _clinicService: ClinicService,
    private _clinicServicesService: ClinicServicesService,
    private _trailService: TrailService,
    private _router: Router,
    private _globalService: GlobalService,
    private _errorService: ErrorService,
    private _emailService: EmailService
    ) { }

  ngOnInit(): void {
    this._globalService.showLoader('Page loading...');
    this.fetchClinics();
    this.fetchClinicServices();

    // Load user data
    this.userDataSubs = this._authService.userData.subscribe(userData => {
      if(!userData) return;
      if(userData.role?.name !== Roles.PATIENT) this._router.navigateByUrl(RouteConstants.UNAUTHORIZED);

      this.userData = userData;
      this._globalService.hideLoader();

      this.fetchBookings();
    });
  }

  fetchClinics(){
    this.clinicSubs = this._clinicService.fetchClinicsAsync().subscribe(clinics => {
      this.clinics = clinics;
    })
  }

  fetchClinicServices() {
    this.clinicServiceSubs = this._clinicServicesService.fetchClinicServicesAsync().subscribe(clinicServices => {
      this.clinicServices = clinicServices;
    });
  }

  async fetchBookings(){
    this.bookingSubs = this._bookingService.fetchBookingsByPatientIdAsync(this.userData?.id!)
      .subscribe({
        next: (bookings: Booking[]) => {
          bookings.forEach(booking => {
            booking.clinic = this.clinics.find(x => x.id === booking.clinicId);
            booking.clinicServices = this.clinicServices.filter(x => booking.clinicServiceIds.includes(x.id!));
            
            // This will be used for filters
            const isAlreadyAdded = this.clinicOptions.find(x => x.id === booking.clinicId);
            if(!isAlreadyAdded){
              const clinic = this.clinics.find(x => x.id === booking.clinicId);
              if(clinic) this.clinicOptions.push(clinic);
            }
          });

          this.bookingHistorySegmentsComponent?.loadBookings(bookings);
        },
        error: (err: any) => {
          this._errorService.handleError(err);
        }
      });
  }

  onRescheduleBooking(booking: Booking){
    const dateDifference = this._globalService.getDatesDifference(booking.bookingDate, new Date());
    if(dateDifference <= 1) {
      this._globalService.showCloseAlert("You can only reschedule bookings two or more days prior to the booking date.");
      return;
    }

    const data = { 
      clinic: booking.clinic,
      userData: this.userData,
      booking: booking
    }
    this.openBookingModal(data);
  }

  async openBookingModal(data: any) {
    try {
      const options = {
        component: BookingComponent,
        swipeToClose: false,
        canDismiss: true,
        backdropDismiss: false,
        cssClass: 'full-screen-modal',
        componentProps: { data },
      };
      
      const bookingRes = await this._globalService.createModal(options);

      if(!bookingRes) return;

      const action = `${ModifierActions.UPDATED} Booking with Clinic ${data.clinic.name}`;
      const updatedModel: any = {
        id: data.booking.id,
        bookingDate: new Date(bookingRes.bookingDate),
        ...this._trailService.updateAudit(action)
      };
      
      this.rescheduleBooking(updatedModel, data.booking);
    } catch(e) {
      this._errorService.handleError(e);
    }
  }

  async rescheduleBooking(updatedModel: any, booking: Booking){
    this._globalService.showLoader('Processing rescheduling...');

    await this._bookingService.updateBooking(updatedModel)
      .then(async () => {
        this._globalService.hideLoader();
        
        this._globalService.showAlert(
          AlertTypeEnum.SUCCESS, 
          `Your have successfulyl rescheduled your booking with clinic <b>${booking.clinic?.name}</b>`, 
          [
            {
              text: 'Okay',
              role: 'cancel',
              cssClass: 'success',
            }
          ] 
        );

        booking.bookingDate = updatedModel.bookingDate;

        this.sendEmailConfirmation(booking);
      })
      .catch(e => {
        console.log(e);
        this._globalService.showCloseAlert('Failed to reschedule the booking. Try again later.')
      });
  }
  
  sendEmailConfirmation(booking: Booking){
    const mail = this._emailService.buildMail(
      [this.userData?.person?.email!], 
      this._emailService.buildReschedulingConfirmationEmailMessage(this.userData!, booking)
    );
    this._emailService.sendEmail(mail);
  };

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

  onWriteReview(booking: Booking){
    const data = { booking };
    this.openReviewModal(data);
  }

  async openReviewModal(data: any) {
    try {
      const options = {
        component: AddReviewComponent,
        swipeToClose: false,
        canDismiss: true,
        backdropDismiss: true,
        componentProps: { data },
      };
      
      const reviewRes = await this._globalService.createModal(options);

      if(!reviewRes) return;

      const action = `${data.review ? ModifierActions.UPDATED : ModifierActions.CREATED} Review to Clinic ${data.booking.clinic.name}`;
      const review: Review = {
        ...reviewRes,
        userId: this.userData?.id,
        ...(data.review ? this._trailService.updateAudit(action) : this._trailService.createAudit(action))
      };
      const booking = {
        id: data.booking.id,
        review
      };

      this.updateBooking(booking);
    } catch(e) {
      this._errorService.handleError(e);
    }
  }

  ionViewDidLeave(): void {
    if(!this.bookingHistorySegmentsComponent) return;

    this.bookingHistorySegmentsComponent.selectedSegment = BookingSegments.ACTIVE_BOOKINGS
  }
  
  ngOnDestroy(): void {
    this.userDataSubs?.unsubscribe();
    this.clinicSubs?.unsubscribe();
    this.clinicServiceSubs?.unsubscribe();
    this.bookingSubs?.unsubscribe();
  }
}
