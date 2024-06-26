import { Component } from '@angular/core';
import { RefresherCustomEvent, ViewWillEnter } from '@ionic/angular';
import { AlertTypeEnum } from 'src/app/constants/alert-logo.enum';
import { ColorConstants } from 'src/app/constants/color.constants';
import { Clinic } from 'src/app/models/clinic.model';
import { ClinicService } from 'src/app/services/clinic.service';
import { ErrorService } from 'src/app/services/error.service';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-clinics',
  templateUrl: './manage-clinics.page.html',
  styleUrls: ['./manage-clinics.page.scss'],
})
export class ManageClinicsPage implements ViewWillEnter {
  clinics: Clinic[] = [];
  paginatedCount: number = environment.paginatedCount;

  constructor(
    private _clinicService: ClinicService, 
    private _globalService: GlobalService,
    private _errorService: ErrorService
    ) { }

  ionViewWillEnter(): void {
    this.fetchClinicsPaginated(this.paginatedCount);
  }

  async fetchClinicsPaginated(count: number, clinicName?: string): Promise<void> {
    this._globalService.showLoader('Loading clinics...');
    this.clinics = await this._clinicService.fetchClinicsPaginated(count, clinicName);
    this._globalService.hideLoader();
  }

  async onRefresh(event: RefresherCustomEvent){
    await this.fetchMoreClinics();
    event.target.complete();
  }

  async onLoadMoreClinics(event: any){
    this.fetchMoreClinics();
    event.target.complete();
  }

  async fetchMoreClinics(){
    const latestClinic = this.clinics[this.clinics.length - 1];
    const clinics = await this._clinicService.fetchClinicsPaginated(this.paginatedCount, latestClinic.name);
    const currentList: Clinic[] = this.clinics;
    clinics.forEach(x => {
      if(!currentList.some(y => y.id === x.id)) this.clinics.push(x);
    })
  }

  async onApproveClinic(clinicId: string) {
    const updatedClinic = {
      id: clinicId,
      isApproved: true
    }
    
    this._globalService.showAlert(
      AlertTypeEnum.CONFIRM, 
      'Are you sure you approve this clinic?',
      [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, 
        {
          text: 'Okay',
          handler: async () => {
            await this.approveClinic(updatedClinic);
          }
        }
      ]
    )
  }

  async approveClinic(updatedClinic: any){
    this._globalService.showLoader('Processing approval...');
    
    await this._clinicService.updateClinic(updatedClinic).then(async () => {
      const index = this.clinics.findIndex(clinic => clinic.id === updatedClinic.id);
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
