import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormConstants } from 'src/app/constants/form.constants';
import { LocationData } from 'src/app/models/location.model';
import { GlobalService } from 'src/app/services/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { TrailService } from 'src/app/services/trail.service';
import { telephoneNumberValidator } from 'src/app/validators/telephone-number-validator';
import { mobileNumberValidator } from 'src/app/validators/mobile-number-validator';
import { SearchLocationComponent } from '../search-location/search-location.component';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { Clinic } from 'src/app/models/clinic.model';
import { UserData } from 'src/app/models/user-data.model';
import { ColorConstants } from 'src/app/constants/color.constants';
import { ClinicService } from 'src/app/services/clinic.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-clinic-registration-form',
  templateUrl: './clinic-registration-form.component.html',
  styleUrls: ['./clinic-registration-form.component.scss'],
})
export class ClinicRegistrationFormComponent  implements OnInit {
  @Input() userData: UserData | undefined;
  @Output() hideClinicSetupForm = new EventEmitter<boolean>;
  registerClinicForm: FormGroup | undefined;
  clinicNameMaxLength: number = FormConstants.clinicNameMaxLength;
  clinicAddressNoMaxLength: number = FormConstants.clinicAddressNoMaxLength;
  landmarkMaxLength: number = FormConstants.landmarkMaxLength;
  telephoneNumberMaxLength: number = FormConstants.telephoneNumberMaxLength;
  mobileNumberMaxLength: number = FormConstants.mobileNumberMaxLength;
  defaultDailyVisitLimit: number = FormConstants.defaultDailyVisitLimit;
  location: LocationData | undefined;

  constructor(
    private _authService: AuthService,
    private _clinicService: ClinicService,
    private _globalService: GlobalService, 
    private _googleMapsService: GoogleMapsService,
    private _trailService: TrailService
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
      mobileNumber: new FormControl('', { validators: [Validators.required, Validators.minLength(this.mobileNumberMaxLength), Validators.maxLength(this.mobileNumberMaxLength), mobileNumberValidator()] }),
      dailyVisitLimit: new FormControl(this.defaultDailyVisitLimit, { validators: [Validators.required, Validators.min(1)] }),
    });

    
    // TODO: DELETE THIS 
    this.registerClinicForm?.get('name')?.setValue('Clinic 1');
    this.registerClinicForm?.get('addressNo')?.setValue('614');
    this.registerClinicForm?.get('landmark')?.setValue('Waltermart');
    this.registerClinicForm?.get('telephoneNumber')?.setValue('04493848483');
    this.registerClinicForm?.get('mobileNumber')?.setValue('09748374758');
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
      const action = `${ModifierActions.CREATED} Clinic ${name}`;
      this.location = {
        ...this.location,
        addressNo: this.registerClinicForm?.value.addressNo,
        landmark: this.registerClinicForm?.value.landmark
      }

      const clinic: Clinic = {
        name,
        location: this.location,
        telephoneNumber: this.registerClinicForm?.value.telephoneNumber,
        mobileNumber: this.registerClinicForm?.value.mobileNumber,
        dailyVisitLimit: this.registerClinicForm?.value.dailyVisitLimit,
        isApproved: false,
        staffIds: [this.userData?.id!],
        ...(this._trailService.createAudit(action))
      }

      // const clinicId = await this.saveClinic(clinic);
      const clinicId = "w4LyRdbPS0ZKZVLj9B2F";
      
      console.log("CLINIC ID");
      console.log(clinicId);
      if(!clinicId) return;

      const userData: any = {
        id: this.userData?.id!,
        clinicId: clinicId
      }

      // const updateRes = await this.updateUserClinicId(userData);
      console.log(userData);

      this._globalService.showToast("Registration Complete!", 3000, ColorConstants.SUCCESS);
      this.hideClinicSetupForm.emit(false);
    }
  }

  async saveClinic(clinic: Clinic): Promise<string | null>{
    this._globalService.showLoader('Saving clinic...');
    
    return await this._clinicService.saveClinic(clinic).then(res => {
      this._globalService.hideLoader()
      return res;
    })
    .catch(e => {
      this._globalService.hideLoader()
      let errorMessage: string = `An error occurred: ${e.code}`;
      this._globalService.showToast(errorMessage);
      return null;
    });
  }

  async updateUserClinicId(updatedModel: any): Promise<boolean> {
    this._globalService.showLoader('Updating staff clinic...');

    return await this._authService.updateUser(updatedModel).then(() => {
      this._globalService.hideLoader()
      return true;
    })
    .catch(e => {
      this._globalService.hideLoader()
      let errorMessage: string = `An error occurred: ${e.code}`;
      this._globalService.showToast(errorMessage);
      return false;
    });
  }

  fetchLocation(event: LocationData) {
    this.location = event;
  }
}
