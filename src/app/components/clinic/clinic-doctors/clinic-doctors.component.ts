import { Component, Input, OnInit } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { Clinic } from 'src/app/models/clinic.model';
import { AddDoctorComponent } from '../../modals/add-doctor/add-doctor.component';
import { GlobalService } from 'src/app/services/global.service';
import { ErrorService } from 'src/app/services/error.service';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { Doctor } from 'src/app/models/doctor.model';
import { TrailService } from 'src/app/services/trail.service';
import { ColorConstants } from 'src/app/constants/color.constants';
import { DoctorService } from 'src/app/services/doctor.service';
import { ClinicService } from 'src/app/services/clinic.service';

@Component({
  selector: 'app-clinic-doctors',
  templateUrl: './clinic-doctors.component.html',
  styleUrls: ['./clinic-doctors.component.scss'],
})
export class ClinicDoctorsComponent  implements OnInit {
  @Input() clinic: Clinic | undefined;
  clinicDoctor: Doctor | undefined | null;

  constructor(
    private _globalService: GlobalService,
    private _errorService: ErrorService,
    private _trailService: TrailService,
    private _doctorService: DoctorService,
    private _clinicService: ClinicService
    ) { }

  ngOnInit() {
    this.fetchDoctor();
  }

  async fetchDoctor(){
    const doctorId = this.clinic?.doctorId;
    if(!doctorId) return;

    this._globalService.showLoader('Fetching doctor data...');
    this.clinicDoctor = await this._doctorService.fetchDoctorById(doctorId);
    this._globalService.hideLoader();
  }
  
  async onRefresh(event: RefresherCustomEvent){
    await this.fetchDoctor();
    event.target.complete();
  }

  onAddDoctor(){
    this.openAddDoctorModal();
  }

  onUpdateDoctor(){
    const data = {
      doctor: this.clinicDoctor,
    }
    
    this.openAddDoctorModal(data);
  }

  async openAddDoctorModal(data?: any) {
    try {
      const options = {
        component: AddDoctorComponent,
        swipeToClose: false,
        canDismiss: true,
        backdropDismiss: true,
        componentProps: { data },
      };
      
      const doctor = await this._globalService.createModal(options);
      if(!doctor || !doctor.person) return;

      const fullName = this._globalService.formatFullName(doctor.person.firstName, doctor.person.middleName, doctor.person.lastName);
      const action = `${data ? ModifierActions.UPDATED : ModifierActions.ADDED} Doctor ${fullName}`;
      const clinicDoctor: Doctor = {
        person: doctor.person,
        specialization: doctor.specialization,
        ...(data ? this._trailService.updateAudit(action) : this._trailService.createAudit(action))
      }

      data ? this.updateDoctor(this.clinicDoctor?.id!, clinicDoctor) : this.saveDoctor(clinicDoctor);
    } catch(e) {
      this._errorService.handleError(e);
    }
  }
  
  async saveDoctor(doctor: Doctor){
    this._globalService.showLoader('Saving doctor information...');

    await this._doctorService.saveDoctor(doctor)
      .then(async (doctorId) => {
        this._globalService.hideLoader();
        if(!doctorId) return;

        const updatedClinicModel = {
          id: this.clinic?.id,
          doctorId
        };
    
        const updateRes = await this.updateClinicDoctorId(updatedClinicModel);
        if(!updateRes) {
          this._globalService.showToast('Failed to save doctor to clinic.');
          return;
        }
        
        // Assign doctor ID to current clinic value
        this.clinic!.doctorId = doctorId;
        
        await this.fetchDoctor();
        
        this._globalService.showToast(`Dr. ${doctor.person.firstName} has been saved.`, 3000, ColorConstants.SUCCESS);
      })
      .catch(e => {
        this._errorService.handleError(e);
      });
  }

  async updateClinicDoctorId(updatedModel: any): Promise<boolean> {
    this._globalService.showLoader('Updating clinic doctor...');

    return await this._clinicService.updateClinic(updatedModel).then(() => {
      this._globalService.hideLoader()
      return true;
    })
    .catch(e => {
      this._errorService.handleError(e);
      return false;
    });
  }
  
  async updateDoctor(id: string, doctor: Doctor) {
    this._globalService.showLoader('Updating doctor information...');
    doctor = { id, ...doctor };

    await this._doctorService.updateDoctor(doctor)
      .then(async () => {
        this._globalService.hideLoader()

        this.clinicDoctor = null; // To refresh card
        await this.fetchDoctor();

        this._globalService.showToast(`Record has been updated.`, 3000, ColorConstants.SUCCESS);
      })
      .catch((e) => {
        this._errorService.handleError(e);
      });
  }
}
