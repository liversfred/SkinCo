import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SeederService } from './services/seeders/seeder.service';
import { AuthService } from './services/auth.service';
import { GlobalService } from './services/global.service';
import { UserData } from './models/user-data.model';
import { AlertTypeEnum } from './constants/alert-logo.enum';
import { PushNotificationService } from './services/push-notification.service';
import { PlatformService } from './services/platform.service';
import { LocalNotificationService } from './services/local-notification.service';
import { BookingService } from './services/booking.service';
import { Subscription, map } from 'rxjs';
import { BookingStatus } from './constants/booking-status.enum';
import { ClinicService } from './services/clinic.service';
import { Clinic } from './models/clinic.model';
import { Booking } from './models/booking-details.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  isAuthenticated: boolean | undefined;
  userData: UserData | undefined;
  clinics: Clinic[] = [];
  bookings: Booking[] = [];
  
  constructor(
    private _seederService: SeederService, 
    private _authService: AuthService, 
    private _globalService: GlobalService,
    private _bookingService: BookingService,
    private _clinicService: ClinicService,
    private _pushNotificationService: PushNotificationService,
    private _localNotificationService: LocalNotificationService,
    private _platformService: PlatformService,
    ) {}

  async ngOnInit() {
    // Start loader
    this._globalService.showLoader();

    if(environment.seedData) {
      await this._seederService.seedAll();

      // Stop loader
      this._globalService.hideLoader();
    }
    else{
      this.fetchClinics();
      
      // Initalize push/local notification
      this._platformService.isReady()
        .then(() => {
          this._pushNotificationService.initialize();
          this._localNotificationService.initialize();
        }).catch(err=> {
          console.log('Error Notification: ', err);
        });

      // Subscribe to detect changes in user data
      this._authService.userData.subscribe(async userData => {
        if(!userData) return;

        this.userData = userData;

        // Subscribe for data notifications
        this.fetchBookings();

        this.isAuthenticated = await this._authService.checkUserAuth();
      });
      
      // Check if user is logged in
      this.isAuthenticated = await this._authService.checkUserAuth();

      // If not, do not proceed and stop the loader
      if(!this.isAuthenticated) {
        this._globalService.hideLoader();
        return; 
      }

      // If yes, load user data and role
      await this._authService.fetchUserData();

      // Stop loader
      this._globalService.hideLoader();
    }
  }

  subscribeToPatientBookings(){
    this.bookings.filter(y => y.patientId === this.userData?.id)
      .forEach(booking => {
        const bookingPosition = this.getBookingPosition(booking);

        if(this._globalService.isPositionForSending(bookingPosition)){
          const positionInWord = this._globalService.getPositionInWord(bookingPosition);
          const title = "Booking Alert";
          const message = `You are ${positionInWord} in line with your booking with ${booking.clinic?.name ?? ''}.`;
          
          const notificationOption = this._bookingService.createBookingNotification(this._localNotificationService.notificationid, title, message);
          this._localNotificationService.scheduleNotification(notificationOption);
        }
      });
  }
  
  fetchBookings(){
    this._bookingService.fetchAllActiveBookingsAsync()
      .pipe(
        map(x => x.filter(y => 
            (y.bookingStatus === BookingStatus.QUEUED || y.bookingStatus === BookingStatus.SKIPPED) &&
            this._globalService.checkIfDatesAreEqual(y.bookingDate, new Date())
          )
        )
      )
      .subscribe({
        next: (bookings: Booking[]) => {
          this.bookings = bookings.map((booking: Booking) => {
            return {
              ...booking,
              clinic: this.clinics.find(clinic => booking.clinicId === clinic.id)
            };
          });

          this.subscribeToPatientBookings();
        },
        error: (err: any) => {
          console.log(err);
        }
      });
  }
  
  fetchClinics(){
    this._clinicService.fetchClinicsAsync()
      .subscribe({
        next: (clinics: Clinic[]) => {
          this.clinics = clinics;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  getBookingPosition(booking: Booking): number{
    const clinicBookings = this.bookings.filter(x => x.clinicId === booking.clinicId && x.bookingStatus === BookingStatus.QUEUED);
    return clinicBookings.findIndex(x => x.id === booking.id) + 1;
  }

  async logout(){
    this._globalService.showAlert(
      AlertTypeEnum.CONFIRM, 
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, 
        {
          text: 'Okay',
          handler: async () => {
            await this._authService.logout();
          }
        }
      ]
    )
  }
}
