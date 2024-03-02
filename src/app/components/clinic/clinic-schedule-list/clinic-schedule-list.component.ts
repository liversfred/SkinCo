import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClinicSchedule } from 'src/app/models/clinic-schedule.model';

@Component({
  selector: 'app-clinic-schedule-list',
  templateUrl: './clinic-schedule-list.component.html',
  styleUrls: ['./clinic-schedule-list.component.scss'],
})
export class ClinicScheduleListComponent {
  @Input() clinicSchedules: ClinicSchedule[] = [];
  @Input() enableSelect: boolean = true;
  @Output() selected = new EventEmitter<ClinicSchedule | undefined>;
  selectedIndex: number = -1; 

  constructor() { }

  toggleHighlight(index: number) {
    if(!this.enableSelect) return;
    this.selectedIndex = this.selectedIndex === index ? -1 : index;
    this.selected.emit(this.clinicSchedules[this.selectedIndex]);
  }
}
