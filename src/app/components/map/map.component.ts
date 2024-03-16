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
  @ViewChild('map') mapElementRef: ElementRef | undefined;
  @Input() setCurrentLocation = true;
  @Input() markerDraggable: boolean = false;
  @Input() center: any = { lat: environment.defaultLat, lng: environment.defaultLng };
  @Output() locationUpdated = new EventEmitter<LocationData>;
  map: any;
  markers: any[] = [];
  mapListeners: any[] = [];
  markerUrl: string = 'assets/icons/location-pin.png';
  mapChange: Subscription | undefined;

  constructor(
    private _googleMapsService: GoogleMapsService,
    private locationService: LocationService,
    private renderer: Renderer2,
    ) { }
    
  async ngAfterViewInit(): Promise<void> {
    // Set listener for marker change once the user searched for location
    this.mapChange = this._googleMapsService.markerChange.subscribe(async(loc) => {
      if(loc?.lat && loc?.lng) {
        const location = await this.getLocationByLatLng(loc.lat, loc.lng);
        this.clearAllMarkers();
        this.setMapCenter(location);
        this.addMarker(location);
      }
    });    
    
    // Set marker to current location if enabled
    if(this.setCurrentLocation) {
      const position = await this.locationService.getCurrentLocation();
      this.center = {
        lat: position?.coords.latitude,
        lng: position?.coords.longitude
      };
    } 

    await this.initMap();

    // Get the current location
    const currentLocationData = await this.getLocation(this.center.lat, this.center.lng);
    if(currentLocationData) this.updateLocation(currentLocationData);
  }

  async initMap(){
    try {
      let googleMaps: any = await this._googleMapsService.loadGoogleMaps();
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
      const location = await this.getLocationByLatLng(this.center.lat, this.center.lng);
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
      this.map.mapTypes.set('appMap', mapType);
      this.map.setMapTypeId('appMap');
      this.renderer.addClass(mapEl, 'visible');

      // Initially point the marker if from clinic registration
      if(this.markerDraggable) this.addMarker(location);
    } catch(e) {
      console.log(e);
    }
  }

  addMarker(location: any) {
    let googleMaps: any = this._googleMapsService.googleMaps;
    const icon = {
      url: this.markerUrl,
      scaledSize: new googleMaps.Size(50, 50), 
    };
    const marker = new googleMaps.Marker({
      position: location,
      map: this.map,
      icon: icon,
      draggable: this.markerDraggable,
      animation: googleMaps.Animation.DROP
    });

    this.markers.push(marker);

    if(this.markerDraggable){
      this.mapListeners.push(
        this._googleMapsService.googleMaps.event.addListener(marker, 'dragend', () => {
          this.getUpdatedLocation(marker.position.lat(), marker.position.lng());
        })
      );
    }
    
    this.mapListeners.push(
      this._googleMapsService.googleMaps.event.addListener(marker, 'click', () => {
        this.getUpdatedLocation(marker.position.lat(), marker.position.lng());
      })
    );
  }

  async setMapCenter(location: any){
    this.map.panTo(location);
  }
  
  async getLocationByLatLng(lat: number, lng: number){
    return await new this._googleMapsService.googleMaps.LatLng(lat, lng);
  }

  async getUpdatedLocation(lat: any, lng: any) {
    const location = await this.getLocation(lat, lng);
    if(location) this.updateLocation(location);
  }

  async updateLocation(location: LocationData){
    this.locationUpdated.emit(location);
  }

  async getLocation(lat: any, lng: any): Promise<LocationData | null> {
    try {
      return await this._googleMapsService.getLocation(lat, lng);
    } catch(e) {
      console.log(e);
      return null;
    }
  }

  setZoom(zoomLevel: number){
    this.map.setZoom(zoomLevel);
  }

  clearAllMarkers(){
    this.markers.forEach(marker => {
      marker.setMap(null);
    })

    this.mapListeners.forEach(listener => {
      this._googleMapsService.googleMaps.event.removeListener(listener);
    });
  }

  ngOnDestroy(): void {
    this.clearAllMarkers();
    this.map = null;
    this.mapChange?.unsubscribe();
  }
}
