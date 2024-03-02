import { Component, Input, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.component.html',
  styleUrls: ['./select-time.component.scss'],
})
export class SelectTimeComponent implements OnInit{
  @Input() data: any;
  selectedTime: any | undefined;

  constructor(private _globalService: GlobalService) { }

  ngOnInit(): void {
    this.selectedTime = this.data?.time ? this._globalService.convertToMilitaryFormat(this.data.time) : this._globalService.getCurrentTime();
  }

  dismiss(val?: any) {
    this._globalService.dismissModal(val);
  }

  done(){
    const formattedTime = this._globalService.convertTo12HourFormat(this.selectedTime);
    this.dismiss(formattedTime);
  }
}
