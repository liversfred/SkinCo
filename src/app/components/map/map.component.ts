import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocationData } from 'src/app/models/location.model';
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { LocationService } from 'src/app/services/location.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent  implements AfterViewInit, OnDestroy {
  @ViewChild('map', {static: true}) mapElementRef: ElementRef | undefined;
  @Input() setCurrentLocation = true;
  @Input() center: any = { lat: environment.defaultLat, lng: environment.defaultLng };
  @Output() location = new EventEmitter<LocationData>;
  googleMaps: any;
  map: any;
  marker: any;
  mapListener: any;
  mapChange: Subscription | undefined;

  constructor(
    private _googleMapsService: GoogleMapsService,
    private renderer: Renderer2,
    private locationService: LocationService
    ) { }

  async ngAfterViewInit() {
    await this.initMap();
    this.mapChange = this._googleMapsService.markerChange.subscribe(async(loc) => {
      if(loc?.lat) {
        const googleMaps = this.googleMaps;
        const location = new googleMaps.LatLng(loc.lat, loc.lng);
        this.map.panTo(location);
        this.marker.setMap(null);
        await this.addMarker(location);
      }
    });    
  }

  async initMap() {
    try {
      if(this.setCurrentLocation) {
        const position = await this.locationService.getCurrentLocation();
        this.center = {
          lat: position?.coords.latitude,
          lng: position?.coords.longitude
        };
        await this.loadMap();
        this.getAddress(this.center.lat, this.center.lng);
      } else {
        await this.loadMap();
      }
    } catch(e) {
      console.log(e);
      this.loadMap();
      this.getAddress(this.center.lat, this.center.lng);
    }
  }

  async loadMap() {
    try {
      let googleMaps: any = await this._googleMapsService.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const style = [
        {
          featureType: 'all',
          elementType: 'all',
          stylers: [
            { saturation: 0 }
          ]
        }
      ];
      const mapEl = this.mapElementRef?.nativeElement;
      const location = new googleMaps.LatLng(this.center.lat, this.center.lng);
      this.map = new googleMaps.Map(mapEl, {
        center: location,
        zoom: 15,
        panControl: true,
        zoomControl: true,
        scaleControl: false,
        streetViewControl: true,
        overviewMapControl: false,
        mapTypeControl: true,
        mapTypeControlOptions: {
          mapTypeIds: [googleMaps.MapTypeId.ROADMAP, googleMaps.MapTypeId.SATELLITE]
        }
      });
      var mapType = new googleMaps.StyledMapType(style, { name: 'Styled Map' });
      this.map.mapTypes.set('myMap', mapType);
      this.map.setMapTypeId('myMap');
      this.renderer.addClass(mapEl, 'visible');
      this.addMarker(location);
    } catch(e) {
      console.log(e);
    }
  }

  addMarker(location: any) {
    let googleMaps: any = this.googleMaps;
    const icon = {
      url: 'assets/icons/location-pin.png',
      scaledSize: new googleMaps.Size(50, 50), 
    };
    this.marker = new googleMaps.Marker({
      position: location,
      map: this.map,
      icon: icon,
      draggable: true,
      animation: googleMaps.Animation.DROP
    });
    this.mapListener = this.googleMaps.event.addListener(this.marker, 'dragend', () => {
      this.getAddress(this.marker.position.lat(), this.marker.position.lng());
    });
  }

  async getAddress(lat: number, lng: number) {
    try {
      const result = await this._googleMapsService.getAddress(lat, lng);
      const locationData: LocationData = {
        initial: result.address_components[0].short_name,
        address: result.formatted_address,
        lat,
        lng
      };
      this.location.emit(locationData);
    } catch(e) {
      console.log(e);
    }
  }

  ngOnDestroy() {
    if(this.mapListener) this.googleMaps.event.removeListener(this.mapListener);
    if(this.mapChange) this.mapChange.unsubscribe();
  }
}
