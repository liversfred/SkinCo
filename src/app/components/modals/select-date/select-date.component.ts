import { Component, Input, OnInit } from '@angular/core';
import { ClinicSchedule } from 'src/app/models/clinic-schedule.model';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.scss'],
})
export class SelectDateComponent  implements OnInit {
  @Input() data: any;
  selectedDate: Date | undefined;
  clinicSchedules: ClinicSchedule[] = [];
  currentDate: Date = new Date();
  minDate: string | undefined;
  maxDate: string | undefined;
  availableSlot: number | undefined;

  constructor(private _globalService: GlobalService) { }

  ngOnInit(): void {
    this.clinicSchedules = this.data.clinicSchedules;

    // Setup min and max date
    const currentDate = new Date()
    const minDate = new Date(currentDate.setDate(1));
    const maxDate = new Date(currentDate);
    maxDate.setMonth(maxDate.getMonth() + 4);
    maxDate.setDate(0);
    this.minDate = minDate.toISOString();
    this.maxDate = maxDate.toISOString();

    this.selectedDate = this.data.bookingdate ?? null;
  }

  isClinicOpen = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDay();
    let open = false;

    if(this.currentDate.getDate() > date.getDate()) return open;
    
    this.clinicSchedules.forEach(x => {
      if(day === this._globalService.getDayOfWeekValue(x.dayOfWeek)) open = true
    });

    return open;
  };

  onSelecteDateChanged(event: any){
    this.selectedDate = event.target.value;

    // TODO: Perform checking on how many available slots

    console.log(this.selectedDate);
  }

  dismiss(val?: any) {
    this._globalService.dismissModal(val);
  }

  done(){
    this.dismiss(this.selectedDate);
  }
}
