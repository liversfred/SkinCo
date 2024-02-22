import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PlatformConstants } from '../constants/platforms.constants';
import { ScreenSizes } from '../constants/screen-sizes.constants';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(private _platform: Platform) { }

  isMobile(){
    return this._platform.platforms().includes(PlatformConstants.MOBILE);
  }

  isDesktop(){
    return this._platform.platforms().includes(PlatformConstants.DESKTOP);
  }

  screenXS(){
    return this._platform.width() < ScreenSizes.XS;
  }
}
