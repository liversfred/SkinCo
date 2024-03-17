import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormConstants } from 'src/app/constants/form.constants';
import { LocationData } from 'src/app/models/location.model';
import { GlobalService } from 'src/app/services/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { TrailService } from 'src/app/services/trail.service';
import { telephoneNumberValidator } from 'src/app/validators/telephone-number-validator.directive';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { Clinic } from 'src/app/models/clinic.model';
import { UserData } from 'src/app/models/user-data.model';
import { ColorConstants } from 'src/app/constants/color.constants';
import { ClinicService } from 'src/app/services/clinic.service';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { SearchLocationComponent } from '../../modals/search-location/search-location.component';
import { numericInputValidator } from 'src/app/validators/numeric-input-validator.directive';
import { environment } from 'src/environments/environment';
import { AlertTypeEnum } from 'src/app/constants/alert-logo.enum';

@Component({
  selector: 'app-clinic-registration-form',
  templateUrl: './clinic-registration-form.component.html',
  styleUrls: ['./clinic-registration-form.component.scss'],
})
export class ClinicRegistrationFormComponent  implements OnInit {
  @Input() userData: UserData | undefined;
  @Input() isFormUpdate: boolean = false;
  @Input() clinic: Clinic | undefined;
  @Output() registrationCompleted = new EventEmitter<string>;
  @Output() updateCompleted = new EventEmitter<boolean>;
  registerClinicForm: FormGroup | undefined;
  clinicNameMaxLength: number = FormConstants.clinicNameMaxLength;
  clinicAddressNoMaxLength: number = FormConstants.clinicAddressNoMaxLength;
  landmarkMaxLength: number = FormConstants.landmarkMaxLength;
  telephoneNumberMaxLength: number = FormConstants.telephoneNumberMaxLength;
  mobileNumberMaxLength: number = FormConstants.mobileNumberMaxLength;
  defaultDailyVisitLimit: number = FormConstants.defaultDailyVisitLimit;
  location: LocationData | undefined;
  mapCenterCoordinates: any = { lat: environment.defaultLat, lng: environment.defaultLng };
  setCurrentLocation: boolean = true;

  constructor(
    private _authService: AuthService,
    private _clinicService: ClinicService,
    private _globalService: GlobalService, 
    private _googleMapsService: GoogleMapsService,
    private _trailService: TrailService,
    private _errorService: ErrorService
    ) { }

  ngOnInit() {
    this.initializeFormGroup();
  }

  initializeFormGroup(){
    this.registerClinicForm = new FormGroup({
      name: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.clinicNameMaxLength)] }),
      addressNo: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.clinicAddressNoMaxLength)] }),
      landmark: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.landmarkMaxLength)] }),
      telephoneNumber: new FormControl('', { validators: [Validators.maxLength(this.telephoneNumberMaxLength), telephoneNumberValidator] }),
      mobileNumber: new FormControl('', { validators: [Validators.required, Validators.minLength(this.mobileNumberMaxLength), Validators.maxLength(this.mobileNumberMaxLength), numericInputValidator()] }),
      dailyVisitLimit: new FormControl(this.defaultDailyVisitLimit, { validators: [Validators.required, Validators.min(1)] }),
    });

    if(this.isFormUpdate){
      this.registerClinicForm?.get('name')?.setValue(this.clinic?.name);
      this.registerClinicForm?.get('addressNo')?.setValue(this.clinic?.location?.addressNo);
      this.registerClinicForm?.get('landmark')?.setValue(this.clinic?.location?.landmark);
      this.registerClinicForm?.get('telephoneNumber')?.setValue(this.clinic?.telephoneNumber);
      this.registerClinicForm?.get('mobileNumber')?.setValue(this.clinic?.mobileNumber);
      this.registerClinicForm?.get('dailyVisitLimit')?.setValue(this.clinic?.dailyVisitLimit);
      // Set marker to the saved location
      this.mapCenterCoordinates = { lat: this.clinic?.location?.lat, lng: this.clinic?.location?.lng }
      this.setCurrentLocation = false;
    }
  }
  
  async searchLocation() {
    try {
      const options = {
        component: SearchLocationComponent,
        cssClass: 'location-modal',
        swipeToClose: true,
      };
      const location = await this._globalService.createModal(options);

      if(location) {
        this.location = location;
        // Update marker
        this._googleMapsService.changeMarkerInMap({ lat: this.location?.lat, lng: this.location?.lng});
      }
    } catch(e) {
      console.log(e);
    }
  }

  async onSubmit(){
    if(!this.location){
      this._globalService.showToast('Select a clinic location.');
      return;
    }

    if(this.registerClinicForm?.valid){
      const name = this.registerClinicForm?.value.name.trim();
      const action = `${this.isFormUpdate ? ModifierActions.UPDATED : ModifierActions.ADDED} Clinic ${name}`;
      this.location = {
        ...this.location,
        addressNo: this.registerClinicForm?.value.addressNo,
        landmark: this.registerClinicForm?.value.landmark
      }

      const clinic: Clinic = {
        name,
        location: this.location,
        telephoneNumber: this.registerClinicForm?.value.telephoneNumber.trim(),
        mobileNumber: this.registerClinicForm?.value.mobileNumber.trim(),
        dailyVisitLimit: this.registerClinicForm?.value.dailyVisitLimit,
        isApproved: false,
        staffIds: [this.userData?.id!],
        ...(this.isFormUpdate ? this._trailService.updateAudit(action) : this._trailService.createAudit(action))
      }
      
      this._globalService.showAlert(
        AlertTypeEnum.CONFIRM, 
        'Do you confirm that the details you entered are correct?',
        [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary'
          }, 
          {
            text: 'Yes',
            handler: async () => {
              this.isFormUpdate ? this.onUpdateClinic(clinic) : this.onSaveClinic(clinic)
            }
          }
        ]
      )
    }
  }

  async onSaveClinic(clinic: Clinic){
    const clinicId = await this.saveClinic(clinic);
              
    if(!clinicId) return;

    const userData: any = {
      id: this.userData?.id!,
      clinicId: clinicId
    }

    const updateRes = await this.updateUserClinicId(userData);

    if(!updateRes) this._globalService.showToast("Registration Failed. Try again later.");
    
    this._globalService.showToast("Registration Complete!", 3000, ColorConstants.SUCCESS);
    this.registrationCompleted.emit(clinicId);
  }

  async onUpdateClinic(clinic: Clinic){
    const updatedClinic: any = {
      id: this.clinic?.id!,
      ...clinic
    }
    const updateRes = await this.updateClinic(updatedClinic);

    if(!updateRes) this._globalService.showToast("Clinic info update failed. Try again later.");
    
    this._globalService.showToast("Clinic info has been updated!", 3000, ColorConstants.SUCCESS);
    this.updateCompleted.emit(updateRes);
  }

  async saveClinic(clinic: Clinic): Promise<string | null>{
    this._globalService.showLoader('Saving clinic...');
    
    return await this._clinicService.saveClinic(clinic).then(res => {
      this._globalService.hideLoader()
      return res;
    })
    .catch(e => {
      this._errorService.handleError(e);
      return null;
    });
  }
  
  async updateClinic(clinic: Clinic): Promise<boolean>{
    this._globalService.showLoader('Updating clinic info...');
    
    return await this._clinicService.updateClinic(clinic).then(() => {
      this._globalService.hideLoader()
      return true;
    })
    .catch(e => {
      this._errorService.handleError(e);
      return false;
    });
  }

  async updateUserClinicId(updatedModel: any): Promise<boolean> {
    this._globalService.showLoader('Updating staff clinic...');

    return await this._authService.updateUser(updatedModel).then(() => {
      this._globalService.hideLoader()
      return true;
    })
    .catch(e => {
      this._errorService.handleError(e);
      return false;
    });
  }

  onLocationUpdated(event: LocationData) {
    this.location = event;
  }
}
