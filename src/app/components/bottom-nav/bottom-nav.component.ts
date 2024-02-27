import { Component } from '@angular/core';
import { RouteConstants } from 'src/app/constants/route.constants';
import { PlatformService } from 'src/app/services/platform.service';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
})
export class BottomNavComponent {
  routes: any = RouteConstants;

  constructor(public _platformService: PlatformService) { }

}
