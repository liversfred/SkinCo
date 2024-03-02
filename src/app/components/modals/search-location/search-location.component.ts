import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocationData } from 'src/app/models/location.model';
import { GlobalService } from 'src/app/services/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent  implements OnInit, OnDestroy {
  query: string | undefined;
  locations: any[] = [];
  locationSub: Subscription | undefined;
  savedClinicLocations: LocationData[] = [];

  constructor(
    private _globalService: GlobalService, 
    private _maps: GoogleMapsService,
    private _locationService: LocationService,
    private _googleMapsService: GoogleMapsService
  ) { }

  ngOnInit() {
    this.locationSub = this._maps.locations.subscribe(locations => {
      this.locations = locations;
    });
  }

  async getSavedClinicLocations() {
    this._globalService.showLoader();
    // TODO: perform near clinics
    this._globalService.hideLoader();
  }

  async onSearchChange(event: any) {
    this._globalService.showLoader();
    this.query = event.detail.value;
    if(this.query && this.query.length > 0) await this._googleMapsService.getLocations(this.query);
    this._globalService.hideLoader();
  }

  dismiss(val?: any) {
    this._globalService.dismissModal(val);
  }

  async chooseLocation(location: LocationData) {
    this.dismiss(location);
  }

  async getCurrentPosition() {
    try {
      this._globalService.showLoader();
      const position = await this._locationService.getCurrentLocation();

      if(!position) return;

      const {latitude, longitude} = position.coords;
      const result = await this._googleMapsService.getAddress(latitude, longitude);
      const location: LocationData = {
        initial: result.address_components[0].short_name,
        address: result.formatted_address,
        lat: latitude,
        lng: longitude
      };
      this._globalService.hideLoader();
      this.dismiss(location);
    } catch(e) {
      console.log(e);
      this._globalService.hideLoader();
      this._globalService.showToast('Check whether GPS is enabled & the App has its permissions');
    }
  }

  ngOnDestroy() {
    if(this.locationSub) this.locationSub.unsubscribe();
  }
}
