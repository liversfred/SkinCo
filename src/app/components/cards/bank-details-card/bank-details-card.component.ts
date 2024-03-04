import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BankDetails } from 'src/app/models/bank-details.model';

@Component({
  selector: 'app-bank-details-card',
  templateUrl: './bank-details-card.component.html',
  styleUrls: ['./bank-details-card.component.scss'],
})
export class BankDetailsCardComponent {
  @Input() bankDetails: BankDetails | undefined;
  @Output() updateBankDetails = new EventEmitter<BankDetails>;

  constructor() { }

  onUpdateBankDetails(bankDetails: BankDetails){
    this.updateBankDetails.emit(bankDetails);
  }
}
