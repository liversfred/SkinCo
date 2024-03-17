import { Component, Input, OnInit } from '@angular/core';
import { ClinicSegments } from 'src/app/constants/clinic-segmets.constants';
import { Clinic } from 'src/app/models/clinic.model';
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
  selectedSegment: string = this.clinicSegments.INFO;

  constructor(private _globalService: GlobalService) { }

  ngOnInit() {
    this.clinic = this.data.clinic;
  }

  dismiss(val?: any) {
    this._globalService.dismissModal(val);
  }
}
