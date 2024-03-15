import { Component, ViewChild } from '@angular/core';
import { IonContent, ViewDidLeave, ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { MapComponent } from 'src/app/components/map/map.component';
import { Clinic } from 'src/app/models/clinic.model';
import { Doctor } from 'src/app/models/doctor.model';
import { ClinicService } from 'src/app/services/clinic.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { ErrorService } from 'src/app/services/error.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements ViewWillEnter, ViewDidLeave{
  clinics: Clinic[] = [];
  doctors: Doctor[] = [];
  filteredClinics: Clinic[] = [];
  loadClinics: boolean = false;
  selectedClinic: Clinic | undefined;
  doctorsSubs: Subscription | undefined;
  clinicsSubs: Subscription | undefined;
  @ViewChild('content') content: IonContent | undefined;
  @ViewChild(MapComponent) mapComponent: MapComponent | undefined;

  constructor(
    private _clinicService: ClinicService,
    private _doctorService: DoctorService,
    private _globalService: GlobalService,
    private _errorService: ErrorService
    ) { }
  
  async ionViewWillEnter(): Promise<void> {
    await this.fetchDoctors();
    await this.fetchClinics();
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
    if(this.mapComponent?.markerIds.length != 0) await this.mapComponent?.map?.removeMarkers(this.mapComponent?.markerIds);

    this.filteredClinics.forEach(async clinic => {
      await this.mapComponent?.addMarker(clinic.location.lat, clinic.location.lng, clinic.name);
    })
  }
  
  onBookClinic(clinic: Clinic){
    console.log(clinic);
  }

  onClinicCardClicked(clinic: Clinic){
    this.selectedClinic = clinic;
    this.mapComponent?.setMapCenter(clinic.location.lat, clinic.location.lng);
    this.scrollToTop();
  }
  
  scrollToTop() {
    this.content?.scrollToTop();
  }
  
  ionViewDidLeave(): void {
    this.doctorsSubs?.unsubscribe();
    this.clinicsSubs?.unsubscribe();
  }
}
