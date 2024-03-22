import { Component, Input, OnInit } from '@angular/core';
import { UserData } from 'src/app/models/user-data.model';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit {
  @Input() data: any;
  userData: UserData | undefined;

  constructor(private _globalService: GlobalService) { }

  ngOnInit() {
    this.userData = this.data.userData;
  }

  dismiss(val?: any) {
    this._globalService.dismissModal(val);
  }
}
