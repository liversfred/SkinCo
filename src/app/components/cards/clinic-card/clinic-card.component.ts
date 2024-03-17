import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Clinic } from 'src/app/models/clinic.model';

@Component({
  selector: 'app-clinic-card',
  templateUrl: './clinic-card.component.html',
  styleUrls: ['./clinic-card.component.scss'],
})
export class ClinicCardComponent {
  @Input() clinic: Clinic | undefined;
  @Input() highlighted: boolean = false;
  @Output() bookClinic = new EventEmitter<Clinic>;
  @Output() viewInMap = new EventEmitter<Clinic>;
  @Output() viewClinic = new EventEmitter<Clinic>;

  constructor() { }

  onBookClinic(){
    this.bookClinic.emit(this.clinic);
  }

  onViewInMap() {
    this.viewInMap.emit(this.clinic)
  }

  onViewClinic(){
    this.viewClinic.emit(this.clinic)
  }
}
