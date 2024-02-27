import { Component, OnInit } from '@angular/core';
import { RouteConstants } from 'src/app/constants/route.constants';
import { PlatformService } from 'src/app/services/platform.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  {
  routes: any = RouteConstants;

  constructor(public _platformService: PlatformService) { }

}
