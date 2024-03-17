import { Component, Input } from '@angular/core';
import { BankDetails } from 'src/app/models/bank-details.model';
import { Clinic } from 'src/app/models/clinic.model';
import { GlobalService } from 'src/app/services/global.service';
import { ErrorService } from 'src/app/services/error.service';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { TrailService } from 'src/app/services/trail.service';
import { ClinicBankDetailsService } from 'src/app/services/clinic-bank-details.service';
import { ColorConstants } from 'src/app/constants/color.constants';
import { RefresherCustomEvent, ViewDidLeave, ViewWillEnter } from '@ionic/angular';
import { AddBankDetailsComponent } from 'src/app/components/modals/add-bank-details/add-bank-details.component';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserData } from 'src/app/models/user-data.model';
import { ClinicService } from 'src/app/services/clinic.service';
import { AlertTypeEnum } from 'src/app/constants/alert-logo.enum';

@Component({
  selector: 'app-clinic-bank-details',
  templateUrl: './clinic-bank-details.page.html',
  styleUrls: ['./clinic-bank-details.page.scss'],
})
export class ClinicBankDetailsPage implements ViewWillEnter, ViewDidLeave {
  @Input() clinic: Clinic | undefined;
  userData: UserData | undefined;
  bankDetailsList: BankDetails[] = [];
  selectedBankDetails: BankDetails | undefined;
  userDataSubs: Subscription | undefined;
  
  constructor(
    private _authService: AuthService,
    private _clinicService: ClinicService,
    private _globalService: GlobalService,
    private _errorService: ErrorService,
    private _trailService: TrailService,
    private _clinicBankDetailsService: ClinicBankDetailsService) { }

  ionViewWillEnter(): void {
    this.userDataSubs = this._authService.userData.subscribe(async userData => {
      this.userData = userData ?? undefined;

      if(!this.userData) return;
      
      await this.fetchClinic();

      if(!this.clinic) return;

      this.fetchBankDetails();
    });
  }

  async fetchClinic(){
    const clinicId = this.userData?.clinicId;
    if(!clinicId) { return; };
    
    this._globalService.showLoader('Fetching clinic info...');
    this.clinic = await this._clinicService.fetchClinicById(clinicId) ?? undefined;
    this.selectedBankDetails = undefined;
    this._globalService.hideLoader();
  }

  async onRefresh(event: RefresherCustomEvent){
    await this.fetchBankDetails();
    event.target.complete();
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
    this._globalService.showLoader('Saving bank details...');
    
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
    this._globalService.showLoader('Updating bank details...');
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

  onDeleteBankDetails(bankDetails: BankDetails){
    this._globalService.showAlert(
      AlertTypeEnum.CONFIRM, 
      `Are you sure you delete ${bankDetails.bankName} details?`,
      [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, 
        {
          text: 'Okay',
          handler: async () => {
            await this.deleteBankDetails(bankDetails)
          }
        }
      ]
    )
  }

  async deleteBankDetails(bankDetails: BankDetails){
    this._globalService.showLoader('Deleting bank details...');
    const action = `${ModifierActions.ARCHIVED} Bank Details ${bankDetails.bankName}`;
    const updatedModel = {
      id: bankDetails.id,
      ...this._trailService.deleteAudit(action)
    }

    await this._clinicBankDetailsService.updateBankDetails(updatedModel)
      .then(async () => {
        this._globalService.hideLoader()
        await this.fetchBankDetails();
        this._globalService.showToast("Bank details has been deleted.", 3000, ColorConstants.SUCCESS);
      })
      .catch((e) => {
        this._errorService.handleError(e);
      });
  }
  
  ionViewDidLeave(): void {
    this.userDataSubs?.unsubscribe();
  }
}
