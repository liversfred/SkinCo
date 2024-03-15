import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationData } from 'src/app/models/location.model';
import { ErrorService } from 'src/app/services/error.service';
import { GlobalService } from 'src/app/services/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent  implements OnInit {
  query: string | undefined;
  locations$: Observable<LocationData[]> | undefined;
  savedClinicLocations: LocationData[] = [];

  constructor(
    private _globalService: GlobalService, 
    private _locationService: LocationService,
    private _googleMapsService: GoogleMapsService,
    private _errorService: ErrorService
  ) { }

  ngOnInit() {
    this.locations$ = this._googleMapsService.locations
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
      const location = await this._googleMapsService.getLocation(latitude, longitude);
      this._globalService.hideLoader();
      this.dismiss(location);
    } catch(err) {
      this._errorService.handleError(err, 'Check whether GPS is enabled & the App has its permissions')
    }
  }
}
