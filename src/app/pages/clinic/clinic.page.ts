import { Component } from '@angular/core';
import { ViewDidLeave, ViewWillEnter } from '@ionic/angular';
import { ClinicSegments } from 'src/app/constants/clinic-segmets.constants';
import { Clinic } from 'src/app/models/clinic.model';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { ClinicService } from 'src/app/services/clinic.service';

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
    private _clinicService: ClinicService
    ) { }

  async ionViewWillEnter() {
    // Load user data
    this._authService.userData.subscribe(async userData => {
      this.userData = userData ?? undefined;

      if(!this.userData) return;
      
      await this.fetchClinic();
    });
  }

  async onRefresh(event: any){
    await this.fetchClinic();
    event.target.complete();
  }

  async fetchClinic(){
    const clinicId = this.userData?.clinicId;
    if(!clinicId) { this.showClinicSetupForm = true; return; };

    this.clinic = await this._clinicService.fetchClinicById(clinicId) ?? undefined;
    this.showClinicSetupForm = this.clinic == undefined;
  }

  async onRegistrationCompleted(clinicId: string){
    if (!this.userData || !clinicId) return;

    this.userData!.clinicId = clinicId;

    await this.fetchClinic();
  }

  onUpdateInfo(event: boolean){
    if(!event) return;
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
