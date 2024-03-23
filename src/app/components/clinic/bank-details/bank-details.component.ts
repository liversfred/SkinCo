import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BankDetails } from 'src/app/models/bank-details.model';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss'],
})
export class BankDetailsComponent {
  @Input() bankDetailsList: BankDetails[] = [];
  @Input() enableUpdate: boolean = true;
  @Output() updateBankDetails = new EventEmitter<BankDetails>;
  @Output() deleteBankDetails = new EventEmitter<BankDetails>;

  constructor() { }

  onUpdateBankDetails(bankDetails: BankDetails){
    this.updateBankDetails.emit(bankDetails);
  }

  onDeleteBankDetails(bankDetails: BankDetails) {
    this.deleteBankDetails.emit(bankDetails);
  }
}
