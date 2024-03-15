import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private _platformService: PlatformService) { }

  async getCurrentLocation() {
    if(!Capacitor.isPluginAvailable('Geolocation')) {
      return null;
    }

    if(this._platformService.isAndroid()){
      const permissionStatus = await Geolocation.checkPermissions();
    
      if(permissionStatus.location != 'granted'){
        const requestStatus = await Geolocation.requestPermissions();
  
        if(requestStatus.location != 'granted') return null;
      }
    }

    let options: PositionOptions = {
      maximumAge: 3000,
      timeout: 10000,
      enableHighAccuracy: false
    };
    return await Geolocation.getCurrentPosition(options);
  }
}
