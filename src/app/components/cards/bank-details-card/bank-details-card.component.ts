import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BankDetails } from 'src/app/models/bank-details.model';

@Component({
  selector: 'app-bank-details-card',
  templateUrl: './bank-details-card.component.html',
  styleUrls: ['./bank-details-card.component.scss'],
})
export class BankDetailsCardComponent {
  @Input() bankDetails: BankDetails | undefined;
  @Input() enableUpdate: boolean = true;
  @Output() updateBankDetails = new EventEmitter<BankDetails>;
  @Output() deleteBankDetails = new EventEmitter<BankDetails>;

  constructor() { }

  onUpdateBankDetails(){
    this.updateBankDetails.emit(this.bankDetails);
  }

  onDeleteBankDetails() {
    this.deleteBankDetails.emit(this.bankDetails);
  }
}
