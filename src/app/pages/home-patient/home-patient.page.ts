import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { MapComponent } from 'src/app/components/map/map.component';
import { BookingComponent } from 'src/app/components/modals/booking/booking.component';
import { AlertTypeEnum } from 'src/app/constants/alert-logo.enum';
import { BookingStatus } from 'src/app/constants/booking-status.enum';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { RouteConstants } from 'src/app/constants/route.constants';
import { Booking } from 'src/app/models/booking-details.model';
import { ClinicServiceData } from 'src/app/models/clinic-service-data.model';
import { Clinic } from 'src/app/models/clinic.model';
import { Doctor } from 'src/app/models/doctor.model';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { BookingService } from 'src/app/services/booking.service';
import { ClinicService } from 'src/app/services/clinic.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { EmailService } from 'src/app/services/email.service';
import { ErrorService } from 'src/app/services/error.service';
import { GlobalService } from 'src/app/services/global.service';
import { TrailService } from 'src/app/services/trail.service';

@Component({
  selector: 'app-home-patient',
  templateUrl: './home-patient.page.html',
  styleUrls: ['./home-patient.page.scss'],
})
export class HomePatientPage implements ViewWillEnter, OnDestroy {
  userData: UserData | undefined;
  clinics: Clinic[] = [];
  doctors: Doctor[] = [];
  filteredClinics: Clinic[] = [];
  loadClinics: boolean = false;
  selectedClinic: Clinic | undefined;
  userSubs: Subscription | undefined;
  clinicsSubs: Subscription | undefined;
  doctorsSubs: Subscription | undefined;
  @ViewChild('content') content: IonContent | undefined;
  @ViewChild(MapComponent) mapComponent: MapComponent | undefined;

  constructor(
    private _authService: AuthService,
    private _clinicService: ClinicService,
    private _doctorService: DoctorService,
    private _bookingService: BookingService,
    private _globalService: GlobalService,
    private _trailService: TrailService,
    private _errorService: ErrorService,
    private _emailService: EmailService,
    private _router: Router
    ) { }

  async ionViewWillEnter(): Promise<void> {
    // Load user data
    this.userSubs = this._authService.userData.subscribe(async userData => this.userData = userData ?? undefined );
    
    this._globalService.showLoader('Loading page...');
    await this.fetchDoctors();
    await this.fetchClinics();
    this._globalService.hideLoader();
  }
  
  async fetchDoctors(){
    this.doctorsSubs = this._doctorService.fetchDoctorsAsync()
      .subscribe({
        next: (doctors: Doctor[]) => {
          this.doctors = doctors;
        },
        error: (err: any) => {
          this._errorService.handleError(err, "Error occured while fetching doctors.");
        },
      });
  }
  
  async fetchClinics(){
    this.clinicsSubs = this._clinicService.fetchClinicsAsync()
      .subscribe({
        next: (clinics: Clinic[]) => {
          this.clinics = clinics.map((clinic: Clinic) => {
            return {
              ...clinic,
              doctor: this.doctors.find(doctor => doctor.id === clinic.doctorId),
            };
          });
        },
        error: (err: any) => {
          this._errorService.handleError(err, "Error occured while fetching clinics.");
        },
      });
  }
  
  async onSearch(event: any){
    this._globalService.showLoader('Fetching clinics...');
    const searchQuery = event.detail.value.toLowerCase();
    this.mapComponent?.setZoom(15);
    
    if(searchQuery === '' && this.loadClinics) {
      this.filteredClinics = this.clinics;
      this._globalService.hideLoader();
      return;
    }

    if(searchQuery === 'near me'){
      const currentLocation = this.mapComponent?.currentLocation;
      if(!currentLocation) return;

      const currentCityProvince = this.getProvinceAndCity(currentLocation.address);
      const currentCity = currentCityProvince.city;
      const currentProvince = currentCityProvince.province;
      
      this.filteredClinics = this.clinics.filter(clinic => {
        const {city, province} = this.getProvinceAndCity(clinic.location.address);
        return currentCity === city && currentProvince === province;
      });
    }
    else{
      this.filteredClinics = this.clinics.filter(clinic => 
            clinic.name?.toLowerCase().includes(searchQuery) || clinic.doctor?.person?.fullName?.toLowerCase().includes(searchQuery) ||
            clinic.doctor?.specialization.name.toLowerCase().includes(searchQuery) ||
            clinic.location.address.toLowerCase().includes(searchQuery) || clinic.location.landmark?.toLowerCase()?.includes(searchQuery));
    }

    // Flag to show/hide the clinics
    this.loadClinics = true;
    
    await this.updateMarkers();
    this._globalService.hideLoader();
  }

  async updateMarkers(){
    this.mapComponent?.clearAllMarkers();

    this.filteredClinics.forEach(async (clinic, index) => {
      const location = await this.mapComponent?.getLocationByLatLng(clinic.location.lat, clinic.location.lng);
      this.mapComponent?.addMarker(location);
      if(index === 0) this.mapComponent?.setMapCenter(location);
    })
  }
  
  async onBookClinic(clinic: Clinic){
    this.selectedClinic = clinic;
    const data = { 
      clinic,
      userData: this.userData
    }

    this.openBookingModal(data)
  }

  onViewClinic(clinic: Clinic){
    this.selectedClinic = clinic;
    const data = { clinic };

    this._clinicService.openClinicDetailsModal(data);
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

      const action = `${ModifierActions.CREATED} Booking with Clinic ${data.clinic.name}`;
      const booking: Booking = {
        bookingNo: bookingRes.bookingNo,
        bookingDate: new Date(bookingRes.bookingDate),
        clinicId: bookingRes.clinicId,
        remarks: bookingRes.remarks,
        clinicServiceIds: bookingRes.clinicServiceIds,
        bookingStatus: BookingStatus.QUEUED,
        patientId: this.userData?.id!,
        ...this._trailService.createAudit(action)
      };
      
      this.saveBooking(booking, bookingRes.clinicServices);
    } catch(e) {
      this._errorService.handleError(e);
    }
  }

  async onViewInMap(clinic: Clinic){
    this.selectedClinic = clinic;
    const location = await this.mapComponent?.getLocationByLatLng(clinic.location.lat, clinic.location.lng);
    this.mapComponent?.setMapCenter(location);
    this.mapComponent?.setZoom(20);
    this.scrollToTop();
  }

  async saveBooking(booking: Booking, clinicServices: ClinicServiceData[]){
    this._globalService.showLoader('Saving booking details...');

    await this._bookingService.saveBooking(booking)
      .then(async (bookingId) => {
        this._globalService.hideLoader();
        
        this._globalService.showAlert(
          AlertTypeEnum.SUCCESS, 
          `Your booking has been saved with booking number <b>${booking.bookingNo}</b>`, 
          [
            {
              text: 'Okay',
              role: 'cancel',
              cssClass: 'success',
            }
          ] 
        );

        this.sendEmailConfirmation(booking, clinicServices);

        this.navigateToBookingHistory();
      })
      .catch(e => {
        console.log(e);
        this._globalService.showCloseAlert('Failed to save the booking request. Try again later.')
      });
  }

  sendEmailConfirmation(booking: Booking, clinicServices: ClinicServiceData[]){
    booking.clinicServices = clinicServices;
    booking.clinic = this.selectedClinic;

    const mail = this._emailService.buildMail(
      [this.userData?.person?.email!], 
      this._emailService.buildBookingConfirmationEmailMessage(this.userData!, booking)
    );
    this._emailService.sendEmail(mail);
  }

  getProvinceAndCity(address: string){
    const addressArray = address.split(', ');
    const province = addressArray[addressArray?.length - 1];
    const city = addressArray[addressArray?.length - 2];

    return { city, province }
  }

  navigateToBookingHistory(){
    this._router.navigateByUrl(RouteConstants.BOOKINGS, {replaceUrl: true});
  }

  scrollToTop() {
    this.content?.scrollToTop();
  }

  ngOnDestroy(): void {
    this.userSubs?.unsubscribe();
  }
}
