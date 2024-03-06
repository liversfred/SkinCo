import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClinicServiceData } from 'src/app/models/clinic-service-data.model';

@Component({
  selector: 'app-clinic-service-card',
  templateUrl: './clinic-service-card.component.html',
  styleUrls: ['./clinic-service-card.component.scss'],
})
export class ClinicServiceCardComponent {
  @Input() clinicService: ClinicServiceData | undefined;
  @Input() enableUpdate: boolean = true;
  @Output() updateClinicService = new EventEmitter<ClinicServiceData>;
  @Output() deleteClinicService = new EventEmitter<ClinicServiceData>;
  @Output() seeMore = new EventEmitter<ClinicServiceData>;

  constructor() { }

  onUpdateClinicService() {
    this.updateClinicService.emit(this.clinicService);
  }

  onDeleteClinicService() {
    this.deleteClinicService.emit(this.clinicService);
  }

  onSeeMore() {
    this.seeMore.emit(this.clinicService);
  }
}
