import { Component, Input, OnInit } from '@angular/core';
import { BankDetails } from 'src/app/models/bank-details.model';
import { Clinic } from 'src/app/models/clinic.model';
import { AddBankDetailsComponent } from '../../modals/add-bank-details/add-bank-details.component';
import { GlobalService } from 'src/app/services/global.service';
import { ErrorService } from 'src/app/services/error.service';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { TrailService } from 'src/app/services/trail.service';
import { ClinicBankDetailsService } from 'src/app/services/clinic-bank-details.service';
import { ColorConstants } from 'src/app/constants/color.constants';

@Component({
  selector: 'app-clinic-bank-details',
  templateUrl: './clinic-bank-details.component.html',
  styleUrls: ['./clinic-bank-details.component.scss'],
})
export class ClinicBankDetailsComponent implements OnInit {
  @Input() clinic: Clinic | undefined;
  bankDetailsList: BankDetails[] = [];
  selectedBankDetails: BankDetails | undefined;
  
  constructor(
    private _globalService: GlobalService,
    private _errorService: ErrorService,
    private _trailService: TrailService,
    private _clinicBankDetailsService: ClinicBankDetailsService) { }

  ngOnInit() {
    this.fetchBankDetails();
  }

  async fetchBankDetails(){
    const clinicId = this.clinic?.id;
    if(!clinicId) return;

    this._globalService.showLoader('Fetching bank details...');
    this.bankDetailsList = await this._clinicBankDetailsService.fetchBankDetailsList(clinicId);
    this._globalService.hideLoader();
  }
  
  onAddBankDetails() {
    this.openAddBankDetailsModal();
  }

  onUpdateBankDetails(bankDetails: BankDetails){
    this.selectedBankDetails = bankDetails;
    const data = { bankDetails }
    this.openAddBankDetailsModal(data);
  }

  
  async openAddBankDetailsModal(data?: any) {
    try {
      const options = {
        component: AddBankDetailsComponent,
        swipeToClose: false,
        canDismiss: true,
        backdropDismiss: false,
        componentProps: { data },
      };
      
      const newBankDetails = await this._globalService.createModal(options);
      if(!newBankDetails) return;

      const action = `${data ? ModifierActions.UPDATED : ModifierActions.ADDED} Bank Details ${newBankDetails.bankName}`;
      const bankDetails: BankDetails = {
        clinicId: this.clinic?.id,
        ...newBankDetails,
        ...(data ? this._trailService.updateAudit(action) : this._trailService.createAudit(action))
      }

      data ? this.updateBankDetails(this.selectedBankDetails?.id!, bankDetails) : this.saveBankDetails(bankDetails);
    } catch(e) {
      this._errorService.handleError(e);
    }
  }

  async saveBankDetails(bankDetails: BankDetails){
    await this._clinicBankDetailsService.saveBanKDetails(bankDetails)
    .then(async (bankDetailsId) => {
      this._globalService.hideLoader();
      
      await this.fetchBankDetails();
      
      this._globalService.showToast(`Bank details for ${bankDetails.bankName} has been saved.`, 3000, ColorConstants.SUCCESS);
    })
    .catch(e => {
      this._errorService.handleError(e);
    });
  }

  async updateBankDetails(id: string, bankDetails: BankDetails) {
    bankDetails = { id, ...bankDetails };

    await this._clinicBankDetailsService.updateBankDetails(bankDetails)
      .then(async () => {
        this._globalService.hideLoader()
        await this.fetchBankDetails();
        this._globalService.showToast(`Record has been updated.`, 3000, ColorConstants.SUCCESS);
      })
      .catch((e) => {
        this._errorService.handleError(e);
      });
  }
}
