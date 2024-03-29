import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewDidLeave, ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ClinicSegments } from 'src/app/constants/clinic-segmets.constants';
import { Roles } from 'src/app/constants/roles.constants';
import { RouteConstants } from 'src/app/constants/route.constants';
import { Clinic } from 'src/app/models/clinic.model';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { ClinicService } from 'src/app/services/clinic.service';
import { GlobalService } from 'src/app/services/global.service';
import { PlatformService } from 'src/app/services/platform.service';

@Component({
  selector: 'app-clinic',
  templateUrl: './clinic.page.html',
  styleUrls: ['./clinic.page.scss'],
})
export class ClinicPage implements OnInit, ViewWillEnter, ViewDidLeave, OnDestroy {
  clinic: Clinic | undefined;
  userData: UserData | undefined;
  showClinicSetupForm: boolean | undefined;
  clinicSegments: any = ClinicSegments;
  selectedSegment: string = this.clinicSegments.INFO;
  isFormUpdate: boolean = false;
  isDesktop: boolean = false;
  userDataSubs: Subscription | undefined;

  constructor(
    private _authService: AuthService,
    private _clinicService: ClinicService,
    private _globalService: GlobalService,
    private _router: Router,
    private _platformService: PlatformService
    ) { }

  ngOnInit(): void {
    this.isDesktop = this._platformService.isDesktop();

    this._globalService.showLoader('Page loading...');

    // Load user data
    this.userDataSubs = this._authService.userData.subscribe(async userData => {
      if(!userData) return;
      if(userData.role?.name !== Roles.STAFF) this._router.navigateByUrl(RouteConstants.UNAUTHORIZED);

      this.userData = userData;
      this._globalService.hideLoader();

      await this.fetchClinic();
    });
  }

  async ionViewWillEnter() {
    if(!this.userData) return;
    await this.fetchClinic();
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
  
  ngOnDestroy(): void {
    this.userDataSubs?.unsubscribe();
  }
}
