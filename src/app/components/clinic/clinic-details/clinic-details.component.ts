import { Component, Input, OnInit } from '@angular/core';
import { ClinicSegments } from 'src/app/constants/clinic-segmets.constants';
import { BankDetails } from 'src/app/models/bank-details.model';
import { Clinic } from 'src/app/models/clinic.model';
import { UserData } from 'src/app/models/user-data.model';
import { ClinicBankDetailsService } from 'src/app/services/clinic-bank-details.service';
import { GlobalService } from 'src/app/services/global.service';
import { PlatformService } from 'src/app/services/platform.service';

@Component({
  selector: 'app-clinic-details',
  templateUrl: './clinic-details.component.html',
  styleUrls: ['./clinic-details.component.scss'],
})
export class ClinicDetailsComponent  implements OnInit {
  @Input() data: any;
  userData: UserData | undefined;
  clinic: Clinic | undefined;
  clinicSegments: any = ClinicSegments;
  bankDetailsList: BankDetails[] = [];
  selectedSegment: string = this.clinicSegments.INFO;
  isDesktop: boolean = false;

  constructor(
    private _globalService: GlobalService, 
    private _clinicBankDetailsService: ClinicBankDetailsService,
    private _platformService: PlatformService
    ) { }

  ngOnInit() {
    this.isDesktop = this._platformService.isDesktop();

    this.clinic = this.data.clinic;
    this.userData = this.data.userData;
    this.fetchBankDetails();
  }

  async fetchBankDetails(){
    const clinicId = this.clinic?.id;
    if(!clinicId) return;

    this.bankDetailsList = await this._clinicBankDetailsService.fetchBankDetailsList(clinicId);
  }

  dismiss(val?: any) {
    this._globalService.dismissModal(val);
  }
}
