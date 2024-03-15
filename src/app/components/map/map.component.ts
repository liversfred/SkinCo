import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { CameraConfig } from '@capacitor/google-maps/dist/typings/definitions';
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
  map: GoogleMap | undefined;
  markerUrl: string = 'assets/icons/location-pin.png';
  markerWidth: number = 30;
  markerHeight: number = 30;
  mapChange: Subscription | undefined;
  currentMarkerId: string | undefined | null;
  markerIds: string[] = [];
  defaultCameraZoom: number = 15;
  cameraZoom: number = 20;

  constructor(
    private _googleMapsService: GoogleMapsService,
    private locationService: LocationService
    ) { }
    
  async ngAfterViewInit(): Promise<void> {
    // Listener for selected location from search
    this.mapChange = this._googleMapsService.markerChange.subscribe(async(loc) => {
      if(loc?.lat && loc?.lng) {
        // Remove current marker
        if(this.currentMarkerId) await this.map?.removeMarker(this.currentMarkerId);
        // Add new marker
        this.currentMarkerId = await this.addMarker(loc.lat, loc.lng);
        // Set new marker and move camera
        this.setMapCenter(loc.lat, loc.lng);
      }
    });
    
    if(this.setCurrentLocation) {
      const position = await this.locationService.getCurrentLocation();
      this.center = {
        lat: position?.coords.latitude,
        lng: position?.coords.longitude
      };
    } 

    await this.initMap();
    if(this.markerDraggable) await this.addMarker(this.center.lat, this.center.lng, 'Current Location');

    // Get current location
    const currentLocationData = await this.getLocation(this.center.lat, this.center.lng);
    if(currentLocationData) this.updateLocation(currentLocationData);
  }

  async initMap(){
    this.map = await GoogleMap.create({
      id: 'my-map', // Unique identifier for this map instance
      element: this.mapElementRef?.nativeElement, // reference to the capacitor-google-map element
      apiKey: environment.googleMapsApiKey, // Your Google Maps API Key
      config: {
        center: {
          // The initial position to be rendered by the map
          lat: this.center.lat,
          lng: this.center.lng,
        },
        zoom: this.defaultCameraZoom, // The initial zoom level to be rendered by the map
        panControl: true,
        zoomControl: true,
        scaleControl: false,
        streetViewControl: true,
      },
    });
  }
  
  async addMarker(lat: number, lng: number, title?: string): Promise<string | null> {
    const marker: Marker = {
        iconUrl: this.markerUrl,
        iconSize: { width: this.markerWidth, height: this.markerHeight },
        coordinate: { lat, lng },
        draggable: this.markerDraggable,
        title: title
      };
    const markerId = await this.map?.addMarker(marker);

    if(!markerId) return null;

    // Save marker ids for removal
    this.markerIds.push(markerId);

    // Add drag event listener if enabled
    if(this.markerDraggable){
      this.map?.setOnMarkerDragEndListener(async (marker) => {
        this.getUpdatedLocation(marker.latitude, marker.longitude);
      });
    }
    
    // Add click listener
    this.map?.setOnMarkerClickListener(async (marker) => {
      this.getUpdatedLocation(marker.latitude, marker.longitude);
    });

    return markerId;
  }

  async setMapCenter(lat: number, lng: number){
    const cameraConf: CameraConfig = {
      coordinate: { lat, lng},
      zoom: this.cameraZoom
    };        

    this.map?.setCamera(cameraConf);
  }

  async getUpdatedLocation(lat: number, lng: number) {
    const location = await this.getLocation(lat, lng);
    if(location) this.updateLocation(location);
  }

  async updateLocation(location: LocationData){
    this.locationUpdated.emit(location);
  }

  async getLocation(lat: number, lng: number): Promise<LocationData | null> {
    try {
      return await this._googleMapsService.getLocation(lat, lng);
    } catch(e) {
      console.log(e);
      return null;
    }
  }

  ngOnDestroy(): void {
    this.map?.removeAllMapListeners()
    this.mapChange?.unsubscribe();
  }
}
