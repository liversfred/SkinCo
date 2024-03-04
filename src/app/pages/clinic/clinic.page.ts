import { Component } from '@angular/core';
import { ViewDidLeave, ViewWillEnter } from '@ionic/angular';
import { ClinicSegments } from 'src/app/constants/clinic-segmets.constants';
import { Clinic } from 'src/app/models/clinic.model';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { ClinicService } from 'src/app/services/clinic.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-clinic',
  templateUrl: './clinic.page.html',
  styleUrls: ['./clinic.page.scss'],
})
export class ClinicPage implements ViewDidLeave, ViewWillEnter {
  clinic: Clinic | undefined;
  userData: UserData | undefined;
  showClinicSetupForm: boolean | undefined;
  clinicSegments: any = ClinicSegments;
  selectedSegment: string = this.clinicSegments.INFO;
  isFormUpdate: boolean = false;

  constructor(
    private _authService: AuthService,
    private _clinicService: ClinicService,
    private _globalService: GlobalService
    ) { }

  async ionViewWillEnter() {
    // Load user data
    this._authService.userData.subscribe(async userData => {
      this.userData = userData ?? undefined;

      if(!this.userData) return;
      
      await this.fetchClinic();
    });
  }

  async onRefresh(){
    await this.fetchClinic();
  }

  async fetchClinic(){
    const clinicId = this.userData?.clinicId;
    if(!clinicId) { this.showClinicSetupForm = true; return; };
    
    this._globalService.showLoader('Fetching clinic info...');
    this.clinic = await this._clinicService.fetchClinicById(clinicId) ?? undefined;
    this.showClinicSetupForm = this.clinic == undefined;
    this._globalService.hideLoader();
  }

  async onRegistrationCompleted(clinicId: string){
    if (!this.userData || !clinicId) return;

    this.userData!.clinicId = clinicId;

    await this.fetchClinic();
  }

  onUpdateInfo(){
    this.isFormUpdate = true;
    this.showClinicSetupForm = true;
  }

  async onUpdateCompleted(event: boolean){
    if (!event) return;
    this.isFormUpdate = false;
    await this.fetchClinic();
  }

  ionViewDidLeave(): void {
    this.showClinicSetupForm = undefined;
    this.selectedSegment = ClinicSegments.INFO;
    this.isFormUpdate = false;
  }
}
