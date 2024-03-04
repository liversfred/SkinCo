import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PlatformConstants } from '../constants/platforms.constants';
import { ScreenSizes } from '../constants/screen-sizes.constants';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(private _platform: Platform) { }

  isAndroid(){
    return this._platform.platforms()[0] == PlatformConstants.ANDROID
          || this._platform.platforms()[0] == PlatformConstants.TABLET
          || this._platform.platforms()[0] == PlatformConstants.PHABLET;
  }

  isDesktop(){
    return this._platform.platforms()[0] == PlatformConstants.DESKTOP;
  }

  screenXS(){
    return this._platform.width() < ScreenSizes.XS;
  }
}
