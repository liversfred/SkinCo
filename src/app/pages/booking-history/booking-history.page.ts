import { Component, OnDestroy } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AlertTypeEnum } from 'src/app/constants/alert-logo.enum';
import { BookingSegments } from 'src/app/constants/booking-segments.enum';
import { BookingStatus } from 'src/app/constants/booking-status.enum';
import { ColorConstants } from 'src/app/constants/color.constants';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { Booking } from 'src/app/models/booking-details.model';
import { ClinicServiceData } from 'src/app/models/clinic-service-data.model';
import { Clinic } from 'src/app/models/clinic.model';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { BookingService } from 'src/app/services/booking.service';
import { ClinicServicesService } from 'src/app/services/clinic-services.service';
import { ClinicService } from 'src/app/services/clinic.service';
import { ErrorService } from 'src/app/services/error.service';
import { GlobalService } from 'src/app/services/global.service';
import { TrailService } from 'src/app/services/trail.service';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.page.html',
  styleUrls: ['./booking-history.page.scss'],
})
export class BookingHistoryPage implements ViewWillEnter, OnDestroy {
  userData: UserData | undefined;
  activeBookings: Booking[] = [];
  previousBookings: Booking[] = [];
  filteredActiveBookings: Booking[] = [];
  filteredPreviousBookings: Booking[] = [];
  clinics: Clinic[] = [];
  clinicServices: ClinicServiceData[] = [];
  bookingSegments: any = BookingSegments;
  selectedSegment: string = this.bookingSegments.ACTIVE_BOOKINGS;
  clinicOptions: Clinic[] = [];
  userDataSubs: Subscription | undefined;
  clinicSubs: Subscription | undefined;
  clinicServiceSubs: Subscription | undefined;
  bookingSubs: Subscription | undefined;

  constructor(
    private _authService: AuthService, 
    private _bookingService: BookingService,
    private _clinicService: ClinicService,
    private _clinicServicesService: ClinicServicesService,
    private _trailService: TrailService,
    private _globalService: GlobalService,
    private _errorService: ErrorService
    ) { }

  async ionViewWillEnter() {
    this.fetchClinics();
    this.fetchClinicServices();

    // Load user data
    this.userDataSubs = this._authService.userData.subscribe(async userData => {
      this.userData = userData ?? undefined;

      if(!this.userData) return;

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
    this.bookingSubs = this._bookingService.fetchBookingsByUserIdAsync(this.userData?.id!)
      .subscribe({
        next: (bookings: Booking[]) => {
          this.activeBookings = [];
          this.previousBookings = [];
          this.clinicOptions = []
      
          bookings.forEach(booking => {
            booking.clinic = this.clinics.find(x => x.id === booking.clinicId),
            booking.clinicServices = this.clinicServices.filter(x => booking.clinicServiceIds.includes(x.id!))
      
            if(booking.bookingStatus !== BookingStatus.COMPLETED && booking.bookingStatus !== BookingStatus.CANCELLED){
              this.activeBookings.push(booking);
            }
            else{              
              this.previousBookings.push(booking);
            }

            // This will be used for filters
            const isAlreadyAdded = this.clinicOptions.find(x => x.id === booking.clinicId);
            if(!isAlreadyAdded){
              const clinic = this.clinics.find(x => x.id === booking.clinicId);
              if(clinic) this.clinicOptions.push(clinic);
            }
          });

          this.filteredActiveBookings = this.activeBookings;
          this.filteredPreviousBookings = this.previousBookings;
        },
        error: (err: any) => {
          this._errorService.handleError(err);
        }
      });
  }

  getSourceArray(): Booking[]{
    return this.selectedSegment === BookingSegments.ACTIVE_BOOKINGS ? this.activeBookings : this.previousBookings; 
  }

  setSourceArrayValue(bookings: Booking[]){
    if(this.selectedSegment === BookingSegments.ACTIVE_BOOKINGS){
      this.filteredActiveBookings = bookings;
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

            this.cancelBooking(updatedModel);
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

  async cancelBooking(updatedModel: any){
    this._globalService.showLoader('Updating booking status...');

    this._bookingService.updateBooking(updatedModel)
      .then(async () => {
        this._globalService.hideLoader();
        this._globalService.showToast(`Booking has been cancelled..`, 3000, ColorConstants.SUCCESS);
      })
      .catch((e) => {
        this._errorService.handleError(e);
      });
  }

  onClearFilters(){
    const sourceArray = this.getSourceArray();
    this.setSourceArrayValue(sourceArray);
  }
  
  ngOnDestroy(): void {
    this.userDataSubs?.unsubscribe();
    this.clinicSubs?.unsubscribe();
    this.clinicServiceSubs?.unsubscribe();
    this.bookingSubs?.unsubscribe();
  }
}
