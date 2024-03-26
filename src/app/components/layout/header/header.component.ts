import { Component, Input } from '@angular/core';
import { Roles } from 'src/app/constants/roles.constants';
import { RouteConstants } from 'src/app/constants/route.constants';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { PlatformService } from 'src/app/services/platform.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  {
  @Input() userData: UserData | undefined;
  roles: any = Roles;
  routes: any = RouteConstants;

  constructor(public _platformService: PlatformService, private _authService: AuthService) { }

  onLogoClicked(){
    this._authService.redirectByUserRole();
  }
}
