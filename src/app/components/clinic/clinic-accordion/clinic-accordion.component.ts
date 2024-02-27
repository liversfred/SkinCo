import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Clinic } from 'src/app/models/clinic.model';

@Component({
  selector: 'app-clinic-accordion',
  templateUrl: './clinic-accordion.component.html',
  styleUrls: ['./clinic-accordion.component.scss'],
})
export class ClinicAccordionComponent {
  @Input() clinic: Clinic | undefined;
  @Output() approveClinic = new EventEmitter<string>;

  constructor() { }

  onApproveClinic(clinicId: string){
    this.approveClinic.emit(clinicId);
  }
}
