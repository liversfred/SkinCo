import { Component, Input } from '@angular/core';
import { LocationData } from 'src/app/models/location.model';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss'],
})
export class LocationDetailsComponent {
  @Input() location: LocationData | undefined;
  @Input() color: string | undefined;

  constructor() { }

}
