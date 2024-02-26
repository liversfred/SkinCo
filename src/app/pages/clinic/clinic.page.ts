import { Component, OnInit } from '@angular/core';
import { Clinic } from 'src/app/models/clinic.model';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { ClinicService } from 'src/app/services/clinic.service';

@Component({
  selector: 'app-clinic',
  templateUrl: './clinic.page.html',
  styleUrls: ['./clinic.page.scss'],
})
export class ClinicPage implements OnInit {
  clinic: Clinic | undefined;
  userData: UserData | undefined;
  showClinicSetupForm: boolean | undefined;

  constructor(
    private _authService: AuthService,
    private _clinicService: ClinicService
    ) { }

  async ngOnInit() {
    // Load user data
    this._authService.userData.subscribe(userData => this.userData = userData ?? undefined);

    // this.clinic = await this._clinicService.saveClinic

    // Check if there's a clinic associated to user
    if(!this.clinic) this.showClinicSetupForm = true;
    else this.showClinicSetupForm = false;
  }

  onHideClinicSetupForm(event: any){
    this.showClinicSetupForm = event;
  }
}
