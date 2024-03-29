import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Booking } from 'src/app/models/booking-details.model';
import { ClinicServiceData } from 'src/app/models/clinic-service-data.model';
import { Clinic } from 'src/app/models/clinic.model';
import { UserData } from 'src/app/models/user-data.model';
import { BookingService } from 'src/app/services/booking.service';
import { ClinicServicesService } from 'src/app/services/clinic-services.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-clinic-reviews',
  templateUrl: './clinic-reviews.component.html',
  styleUrls: ['./clinic-reviews.component.scss'],
})
export class ClinicReviewsComponent  implements OnInit, OnDestroy {
  @Input() clinic: Clinic | undefined;
  users: UserData[] = [];
  bookingsWithReviews: Booking[] = [];
  clinicServices: ClinicServiceData[] = [];
  clinicReviewRate: number | undefined;
  bookingsSubs: Subscription | undefined;
  usersSubs: Subscription | undefined;
  clinicServiceSubs: Subscription | undefined;

  constructor(private _bookingService: BookingService, private _userService: UserService, private _clinicServicesService: ClinicServicesService) { }

  ngOnInit() {
    this.fetchUsers();
    this.fetchClinicServices();
    this.fetchBookingsWithReviews();
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

  fetchBookingsWithReviews(){
    this.bookingsSubs = this._bookingService.fetchBookingsByClinicIdAsync(this.clinic?.id!).subscribe(bookings => {
      let rateSum: number = 0;
      this.bookingsWithReviews = [];
      
      bookings.forEach(booking => {
        if(booking.review) {
          booking.patient = this.users.find(x => x.id === booking.patientId),
          booking.clinicServices = this.clinicServices.filter(x => booking.clinicServiceIds.includes(x.id!));
          rateSum+=booking.review.rating;
          this.bookingsWithReviews.push(booking);
        }
      });

      this.clinicReviewRate = rateSum / this.bookingsWithReviews.length;
    });
  }

  ngOnDestroy(): void {
    this.usersSubs?.unsubscribe();
    this.bookingsSubs?.unsubscribe();
  }
}
