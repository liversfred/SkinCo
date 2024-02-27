import { Component, Input } from '@angular/core';
import { Roles } from 'src/app/constants/roles.constants';
import { RouteConstants } from 'src/app/constants/route.constants';
import { UserData } from 'src/app/models/user-data.model';
import { PlatformService } from 'src/app/services/platform.service';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
})
export class BottomNavComponent {
  @Input() userData: UserData | undefined;
  roles: any = Roles;
  routes: any = RouteConstants;

  constructor(public _platformService: PlatformService) { }

}
