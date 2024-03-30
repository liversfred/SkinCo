import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Roles } from 'src/app/constants/roles.constants';
import { RouteConstants } from 'src/app/constants/route.constants';
import { Clinic } from 'src/app/models/clinic.model';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { BookingService } from 'src/app/services/booking.service';
import { ClinicService } from 'src/app/services/clinic.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit, AfterViewInit, OnDestroy {
  userData: UserData | undefined;
  clinics: Clinic[] = [];
  clinicsChart: any = {};;
  bookingsByClinicChart: any = {};
  userDataSubs: Subscription | undefined;
  clinicSubs: Subscription | undefined;
  bookingsSubs: Subscription | undefined;

  constructor(
    private _authService: AuthService,
    private _globalService: GlobalService, 
    private _clinicService: ClinicService,
    private _bookingService: BookingService,
    private _router: Router)
     { }

  ngOnInit() {
    this._globalService.showLoader('Page loading...');

    // Load user data
    this.userDataSubs = this._authService.userData.subscribe(userData => {
      if(!userData) return;
      if(userData.role?.name !== Roles.ADMIN) this._router.navigateByUrl(RouteConstants.UNAUTHORIZED);

      this.userData = userData;
      this._globalService.hideLoader();
    });
  }
  
  ngAfterViewInit(): void {
    this.fetchClinics();
    this.fetchBookings();
  }

  fetchClinics(){
    this.clinicSubs = this._clinicService.fetchClinicsAsync(true).subscribe(clinics => {
      if(!clinics) return;
      this.clinics = clinics;
      this.clinicsChart = undefined;

      const approvedClinics = clinics.filter(x => x.isApproved);
      const pendingClinics = clinics.filter(x => !x.isApproved);
      const archivedClinics = clinics.filter(x => !x.isActive);

      const dataPoints = [
        { label: "Approved", y: approvedClinics.length },
        { label: "Pending", y: pendingClinics.length },
        { label: "Archived", y: archivedClinics.length },
      ];

      this.setupClinicChart(dataPoints);
    });
  }

  fetchBookings(){
    this.bookingsSubs = this._bookingService.fetchAllBookings().subscribe(bookings => {
      if(!bookings) return;
      this.bookingsByClinicChart = undefined;

      let dataPoints: any = [];
      this.clinics.forEach(clinic => {
        const bookingsByClinic = bookings.filter(x => x.clinicId === clinic.id);

        const dataPoint = {
          name: clinic.name,
          y: bookingsByClinic.length
        };
        dataPoints.push(dataPoint);
      })
      
      this.setupBookingsByClinicChart(dataPoints);
    });
  }

  setupClinicChart(dataPoints: any){
    setTimeout(() => {
      this.clinicsChart = {
        title:{
          text: "Clinics Status"
        },
        animationEnabled: true,
        axisY: {
          includeZero: true,
        },
        data: [{
          type: "bar",
          indexLabel: "{y}",
          yValueFormatString: "#,###",
          dataPoints: dataPoints
        }]
      };
    }, 10);
  }

  setupBookingsByClinicChart(dataPoints: any){
    setTimeout(() => {
      this.bookingsByClinicChart = {
        animationEnabled: true,
        title:{
          text: "Bookings By Clinic"
        },
        data: [{
          type: "doughnut",
          yValueFormatString: "#,###.##' Bookings'",
          indexLabel: "{name}",
          dataPoints: dataPoints
        }]
      };
    }, 10);
  }

  ngOnDestroy(): void {
    this.userDataSubs?.unsubscribe();
    this.clinicSubs?.unsubscribe();
    this.bookingsSubs?.unsubscribe();
  }
}
