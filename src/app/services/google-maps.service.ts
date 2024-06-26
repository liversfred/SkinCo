import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { LocationData } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  googleMaps: any;
  private _locations = new BehaviorSubject<LocationData[]>([]);
  private _markerChange = new BehaviorSubject<any>({});

  get locations() {
    return this._locations.asObservable();
  }

  get markerChange() {
    return this._markerChange.asObservable();
  }

  constructor(private http: HttpClient, private zone: NgZone) {}

  loadGoogleMaps(): Promise<any> {
    const win = window as any;
    const gModule = win.google;

    if(gModule && gModule.maps) return Promise.resolve(gModule.maps);

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        const loadedGoogleModule = win.google;
        if(loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Map SDK is not Available');
        }
      };
    });
  }

  async getLocation(lat: number, lng: number): Promise<LocationData | null> {
    return await new Promise((resolve, reject) => {
      this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsApiKey}`)
        .pipe(
          map(geoData => {
            if(!geoData || !geoData.results || geoData.results.length === 0) throw(null);
            return geoData.results[0];
          }),
          map((geoData: any) => {
            return {
              initial: geoData.address_components[0].short_name,
              address: geoData.formatted_address,
              lat,
              lng
            } as LocationData;
          })
        ).subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (err: any) => {
            reject(err);
          }
        })
    });
  }

  async getLocations(query: any) {
    try {
      if(!this.googleMaps) this.googleMaps = await this.loadGoogleMaps();

      let googleMaps: any = this.googleMaps;
      let service = new googleMaps.places.AutocompleteService();

      service.getPlacePredictions(
        {
          input: query,
          componentRestrictions: {
            country: 'PH'
          }
        },
        (predictions: any) => {
          let autoCompleteItems: any[] = [];
          this.zone.run(() => {
            if(predictions != null) {
              predictions.forEach(async (prediction: any) => {
                let latLng: any = await this.geoCode(prediction.description, googleMaps);
                const location: LocationData = {
                  initial: prediction.structured_formatting.main_text,
                  address: prediction.description,
                  lat: latLng.lat,
                  lng: latLng.lng
                };
                autoCompleteItems.push(location);
              });
              this._locations.next(autoCompleteItems);
            }
          });
        });
    } catch(e) {
      console.log(e);
    }
  }

  private geoCode(address: any, googleMaps: any) {
    let latlng = {lat: '', lng: ''};
    
    return new Promise((resolve, reject) => {
      let geocoder = new googleMaps.Geocoder();
      geocoder.geocode({'address' : address}, (results: any) => {
        latlng.lat = results[0].geometry.location.lat();
        latlng.lng = results[0].geometry.location.lng();
        resolve(latlng);
      });
    })
  }

  changeMarkerInMap(location: any) {
    this._markerChange.next(location);
  }
}
