import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormConstants } from 'src/app/constants/form.constants';
import { BankDetails } from 'src/app/models/bank-details.model';
import { GlobalService } from 'src/app/services/global.service';
import { numericInputValidator } from 'src/app/validators/numeric-input-validator.directive';

@Component({
  selector: 'app-add-bank-details',
  templateUrl: './add-bank-details.component.html',
  styleUrls: ['./add-bank-details.component.scss'],
})
export class AddBankDetailsComponent  implements OnInit {
  @Input() data: any;
  addBankDetailsForm: FormGroup | undefined;
  bankNameMaxLength: number = FormConstants.bankNameMaxLength;
  accountNameMaxLength: number = FormConstants.accountNameMaxLength;
  accountNumberMaxLength: number = FormConstants.accountNumberMaxLength;

  constructor(
    private _globalService: GlobalService
  ) { }

  ngOnInit() {
    this.initializeFormGroup();
  }

  initializeFormGroup(){
    this.addBankDetailsForm = new FormGroup({
      bankName: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.bankNameMaxLength)] }),
      accountName: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.accountNameMaxLength)] }),
      accountNumber: new FormControl(null, { validators: [Validators.required, Validators.maxLength(this.accountNumberMaxLength), numericInputValidator()] }),
    });

    if(this.data?.bankDetails) {
      const bankDetails: BankDetails = this.data.bankDetails;
      this.addBankDetailsForm?.get('bankName')?.setValue(bankDetails.bankName);
      this.addBankDetailsForm?.get('accountName')?.setValue(bankDetails.accountName);
      this.addBankDetailsForm?.get('accountNumber')?.setValue(bankDetails.accountNumber);
    }
  }
  
  dismiss(val?: any) {
    this._globalService.dismissModal(val);
  }

  done(){
    if(this.addBankDetailsForm?.invalid) {
      this._globalService.showErrorAlert("Please fill in all the fields.");
      return;
    }

    const bankDetails: any = {
      bankName: this.addBankDetailsForm?.value.bankName.trim(),
      accountName: this.addBankDetailsForm?.value.accountName.trim(),
      accountNumber: this.addBankDetailsForm?.value.accountNumber.trim()
    } 
    
    this.dismiss(bankDetails);
  }
}
