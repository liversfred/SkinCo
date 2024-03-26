import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Roles } from 'src/app/constants/roles.constants';
import { RouteConstants } from 'src/app/constants/route.constants';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit, OnDestroy {
  userData: UserData | undefined;
  userDataSubs: Subscription | undefined;

  constructor(
    private _authService: AuthService,
    private _globalService: GlobalService, 
    private _router: Router)
     { }

  ngOnInit() {
    this._globalService.showLoader('Page loading...');

    // Load user data
    this.userDataSubs = this._authService.userData.subscribe(userData => {
      if(!userData) return;
      if(userData.role?.name !== Roles.ADMIN) this._router.navigateByUrl(RouteConstants.UNAUTHORIZED);

      this.userData = userData;
      this._globalService.hideLoader();
    });
  }

  ngOnDestroy(): void {
    this.userDataSubs?.unsubscribe();
  }
}
