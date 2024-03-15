import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Clinic } from 'src/app/models/clinic.model';

@Component({
  selector: 'app-clinic-card',
  templateUrl: './clinic-card.component.html',
  styleUrls: ['./clinic-card.component.scss'],
})
export class ClinicCardComponent {
  @Input() clinic: Clinic | undefined;
  @Output() bookClinic = new EventEmitter<Clinic>;

  constructor() { }

  onBookClinic(){
    this.bookClinic.emit(this.clinic);
  }
}
