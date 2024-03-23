import { Component, Input, OnInit } from '@angular/core';
import { ClinicSegments } from 'src/app/constants/clinic-segmets.constants';
import { BankDetails } from 'src/app/models/bank-details.model';
import { Clinic } from 'src/app/models/clinic.model';
import { ClinicBankDetailsService } from 'src/app/services/clinic-bank-details.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-clinic-details',
  templateUrl: './clinic-details.component.html',
  styleUrls: ['./clinic-details.component.scss'],
})
export class ClinicDetailsComponent  implements OnInit {
  @Input() data: any;
  clinic: Clinic | undefined;
  clinicSegments: any = ClinicSegments;
  bankDetailsList: BankDetails[] = [];
  selectedSegment: string = this.clinicSegments.INFO;

  constructor(private _globalService: GlobalService, private _clinicBankDetailsService: ClinicBankDetailsService) { }

  ngOnInit() {
    this.clinic = this.data.clinic;
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
