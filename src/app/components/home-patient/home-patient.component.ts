import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Clinic } from 'src/app/models/clinic.model';
import { Doctor } from 'src/app/models/doctor.model';
import { MapComponent } from '../map/map.component';
import { ClinicService } from 'src/app/services/clinic.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { BookingService } from 'src/app/services/booking.service';
import { GlobalService } from 'src/app/services/global.service';
import { ErrorService } from 'src/app/services/error.service';
import { Router } from '@angular/router';
import { TrailService } from 'src/app/services/trail.service';
import { BookingComponent } from '../modals/booking/booking.component';
import { BookingDetails } from 'src/app/models/booking-details.model';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { UserData } from 'src/app/models/user-data.model';
import { ClinicDetailsComponent } from '../clinic/clinic-details/clinic-details.component';
import { AlertTypeEnum } from 'src/app/constants/alert-logo.enum';
import { RouteConstants } from 'src/app/constants/route.constants';

@Component({
  selector: 'app-home-patient',
  templateUrl: './home-patient.component.html',
  styleUrls: ['./home-patient.component.scss'],
})
export class HomePatientComponent  implements OnInit, OnDestroy {
  @Input() user: UserData | undefined;
  clinics: Clinic[] = [];
  doctors: Doctor[] = [];
  filteredClinics: Clinic[] = [];
  loadClinics: boolean = false;
  selectedClinic: Clinic | undefined;
  doctorsSubs: Subscription | undefined;
  clinicsSubs: Subscription | undefined;
  @Output() scrollToTop = new EventEmitter<void>;
  @ViewChild(MapComponent) mapComponent: MapComponent | undefined;

  constructor(
    private _clinicService: ClinicService,
    private _doctorService: DoctorService,
    private _bookingService: BookingService,
    private _globalService: GlobalService,
    private _trailService: TrailService,
    private _errorService: ErrorService,
    private _router: Router
    ) { }

  async ngOnInit() {
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
  
    // Flag to show/hide the clinics
    this.loadClinics = true;
  
    this.filteredClinics = this.clinics.filter(clinic => 
          clinic.name?.toLowerCase().includes(searchQuery) || clinic.doctor?.person?.fullName?.toLowerCase().includes(searchQuery) ||
          clinic.doctor?.specialization.name.toLowerCase().includes(searchQuery) ||
          clinic.location.address.toLowerCase().includes(searchQuery) || clinic.location.landmark?.toLowerCase()?.includes(searchQuery));
      
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
    const data = { clinic };

    this.openBookingModal(data)
  }

  onViewClinic(clinic: Clinic){
    this.selectedClinic = clinic;
    const data = { clinic }

    this.openClinicDetailsModal(data);
  }

  async openBookingModal(data?: any) {
    try {
      const options = {
        component: BookingComponent,
        swipeToClose: false,
        canDismiss: true,
        backdropDismiss: false,
        cssClass: 'full-screen-modal',
        componentProps: { data },
      };
      
      const bookingDetailsRes = await this._globalService.createModal(options);

      if(!bookingDetailsRes) return;

      const action = `${data.bookingDetails ? ModifierActions.UPDATED : ModifierActions.CREATED} Booking with Clinic ${data.clinic.name}`;
      const bookingDetails: BookingDetails = {
        ...bookingDetailsRes,
        userId: this.user?.id,
        ...(data ? this._trailService.updateAudit(action) : this._trailService.createAudit(action))
      }

      this.saveBooking(bookingDetails)
      // data.bookingDetails ? this.updateBookingDetails(this.clinicDoctor?.id!, clinicDoctor) : this.saveDoctor(clinicDoctor);
    } catch(e) {
      this._errorService.handleError(e);
    }
  }

  async openClinicDetailsModal(data?: any) {
    console.log(data);
    try {
      const options = {
        component: ClinicDetailsComponent,
        swipeToClose: false,
        canDismiss: true,
        backdropDismiss: true,
        cssClass: 'full-screen-modal',
        componentProps: { data },
      };
      
      await this._globalService.createModal(options);
    } catch(e) {
      this._errorService.handleError(e);
    }
  }

  async onViewInMap(clinic: Clinic){
    this.selectedClinic = clinic;
    const location = await this.mapComponent?.getLocationByLatLng(clinic.location.lat, clinic.location.lng);
    this.mapComponent?.setMapCenter(location);
    this.mapComponent?.setZoom(20);
    this.scrollToTop.emit();
  }

  async saveBooking(bookingDetails: BookingDetails){
    this._globalService.showLoader('Saving booking details...');

    await this._bookingService.saveBooking(bookingDetails)
      .then(async (bookingId) => {
        this._globalService.hideLoader();
        
        this._globalService.showAlert(
          AlertTypeEnum.SUCCESS, 
          `Your booking has been saved with booking number <b>${bookingDetails.bookingNo}</b>`, 
          [
            {
              text: 'Okay',
              role: 'cancel',
              cssClass: 'success',
            }
          ] 
        );

        this.navigateToBookingHistory();
      })
      .catch(e => {
        this._errorService.handleError(e);
      });
  }

  navigateToBookingHistory(){
    this._router.navigateByUrl(RouteConstants.BOOKING_HISTORY, {replaceUrl: true});
  }
  
  // async updateBooking(id: string, bookingDetails: BookingDetails) {
  //   this._globalService.showLoader('Updating booking details...');
  //   bookingDetails = { id, ...bookingDetails };

  //   await this._bookingService.updateBooking(bookingDetails)
  //     .then(async () => {
  //       this._globalService.hideLoader()
  //       // TODO: NAVIGATE and show alert
  //       // this._globalService.showToast(`Booking Saved!.`, 3000, ColorConstants.SUCCESS);
  //     })
  //     .catch((e) => {
  //       this._errorService.handleError(e);
  //     });
  // }

  ngOnDestroy(): void {
    this.doctorsSubs?.unsubscribe();
    this.clinicsSubs?.unsubscribe();
  }
}
