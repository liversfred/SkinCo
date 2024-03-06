import { Component, Input } from '@angular/core';
import { GenericData } from 'src/app/models/generic-data.model';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-generic',
  templateUrl: './generic.component.html',
  styleUrls: ['./generic.component.scss'],
})
export class GenericComponent {
  @Input() data: GenericData | undefined;

  constructor(private _globalService: GlobalService) { }

  dismiss(val?: any) {
    this._globalService.dismissModal(val);
  }
}
