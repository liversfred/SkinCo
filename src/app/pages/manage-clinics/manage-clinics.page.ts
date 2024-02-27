import { Component } from '@angular/core';
import { InfiniteScrollCustomEvent, RefresherCustomEvent, ViewWillEnter } from '@ionic/angular';
import { ColorConstants } from 'src/app/constants/color.constants';
import { Clinic } from 'src/app/models/clinic.model';
import { ClinicService } from 'src/app/services/clinic.service';
import { ErrorService } from 'src/app/services/error.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-manage-clinics',
  templateUrl: './manage-clinics.page.html',
  styleUrls: ['./manage-clinics.page.scss'],
})
export class ManageClinicsPage implements ViewWillEnter {
  clinics: Clinic[] = [];

  constructor(
    private _clinicService: ClinicService, 
    private _globalService: GlobalService,
    private _errorService: ErrorService
    ) { }

  ionViewWillEnter(): void {
    this.fetchClinics();
  }

  async fetchClinics(): Promise<void> {
    this._globalService.showLoader('Loading clinics...');
    this.clinics = await this._clinicService.fetchClinics();
    this._globalService.hideLoader();
  }

  async onRefresh(event: RefresherCustomEvent){
    await this.fetchClinics();
    event.target.complete();
  }

  async onApproveClinic(clinicId: string) {
    const updatedClinic = {
      id: clinicId,
      isApproved: true
    }

    this._globalService.showLoader('Processing approval...');
    
    await this._clinicService.updateClinic(updatedClinic).then(async () => {
      const index = this.clinics.findIndex(clinic => clinic.id === clinicId);
      const clinic = this.clinics[index];
      clinic.isApproved = true;
      this._globalService.hideLoader()
      this._globalService.showToast(`Approval for ${clinic.name} is successful!`, 3000, ColorConstants.SUCCESS);
      return true;
    })
    .catch(e => {
      this._errorService.handleError(e);
      return false;
    });
  }
}
