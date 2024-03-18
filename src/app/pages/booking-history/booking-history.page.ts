import { Component, OnDestroy } from '@angular/core';
import { RefresherCustomEvent, ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { BookingSegments } from 'src/app/constants/booking-segments.enum';
import { BookingStatus } from 'src/app/constants/booking-status.enum';
import { Booking } from 'src/app/models/booking-details.model';
import { ClinicServiceData } from 'src/app/models/clinic-service-data.model';
import { Clinic } from 'src/app/models/clinic.model';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { BookingService } from 'src/app/services/booking.service';
import { ClinicServicesService } from 'src/app/services/clinic-services.service';
import { ClinicService } from 'src/app/services/clinic.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.page.html',
  styleUrls: ['./booking-history.page.scss'],
})
export class BookingHistoryPage implements ViewWillEnter, OnDestroy {
  userData: UserData | undefined;
  activeBookings: Booking[] = [];
  previousBookings: Booking[] = [];
  clinics: Clinic[] = [];
  clinicServices: ClinicServiceData[] = [];
  bookingSegments: any = BookingSegments;
  selectedSegment: string = this.bookingSegments.ACTIVE_BOOKINGS;
  userDataSubs: Subscription | undefined;
  clinicSubs: Subscription | undefined;
  clinicServiceSubs: Subscription | undefined;
  bookingSubs: Subscription | undefined;

  constructor(
    private _authService: AuthService, 
    private _bookingService: BookingService,
    private _clinicService: ClinicService,
    private _clinicServicesService: ClinicServicesService,
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
  
  async onRefresh(event: RefresherCustomEvent){
    await this.fetchBookings();
    event.target.complete();
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
    this.activeBookings = [];
    this.previousBookings = [];

    this.bookingSubs = this._bookingService.fetchBookingsByUserIdAsync(this.userData?.id!)
      .subscribe({
        next: (bookings: Booking[]) => {
          bookings.forEach(booking => {
            booking.clinic = this.clinics.find(x => x.id === booking.clinicId),
            booking.clinicServices = this.clinicServices.filter(x => booking.clinicServiceIds.includes(x.id!))
      
            if(booking.bookingStatus === BookingStatus.COMPLETED){
              this.previousBookings.push(booking);
            }
            else{
              this.activeBookings.push(booking);
            }
          });
        },
        error: (err: any) => {
          this._errorService.handleError(err);
        }
      });
  }
  
  ngOnDestroy(): void {
    this.userDataSubs?.unsubscribe();
    this.clinicSubs?.unsubscribe();
    this.clinicServiceSubs?.unsubscribe();
    this.bookingSubs?.unsubscribe();
  }
}
