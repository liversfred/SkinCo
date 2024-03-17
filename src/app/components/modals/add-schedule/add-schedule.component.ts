import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { SelectTimeComponent } from '../select-time/select-time.component';
import { DayOfWeek } from 'src/app/constants/day-of-week.constants';
import { ClinicSchedule } from 'src/app/models/clinic-schedule.model';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.scss'],
})
export class AddScheduleComponent implements OnInit{
  @Input() data: any;
  addScheduleForm: FormGroup | undefined;
  dayOfWeekOptions: any[] = [...DayOfWeek.DAY_OF_WEEK_OPTIONS];

  constructor(private _globalService: GlobalService) { }

  ngOnInit(): void {
    this.initializeFormGroup();
  }

  initializeFormGroup(){
    this.addScheduleForm = new FormGroup({
      dayOfWeek: new FormControl(null, { validators: [Validators.required] }),
      startTime: new FormControl(null, { validators: [Validators.required] }),
      endTime: new FormControl(null, { validators: [Validators.required] }),
    });

    if(this.data?.clinicSchedule) {
      const clinicSchedule: ClinicSchedule = this.data.clinicSchedule;
      this.addScheduleForm?.get('dayOfWeek')?.setValue(clinicSchedule.dayOfWeek);
      this.addScheduleForm?.get('startTime')?.setValue(clinicSchedule.startTime);
      this.addScheduleForm?.get('endTime')?.setValue(clinicSchedule.endTime);
    }
  }

  dismiss(val?: any) {
    this._globalService.dismissModal(val);
  }

  done(){
    if(this.addScheduleForm?.invalid) {
      this._globalService.showCloseAlert("Please complete the required fields.");
      return;
    }

    const clinicSchedule: any = {
      dayOfWeek: this.addScheduleForm?.value.dayOfWeek,
      startTime: this.addScheduleForm?.value.startTime,
      endTime: this.addScheduleForm?.value.endTime,
    } 

    // Validate if the start time is ahead
    const isStartTimeAhead = this._globalService.isStartTimeAhead(
      this._globalService.convertToMilitaryFormat(clinicSchedule.startTime), 
      this._globalService.convertToMilitaryFormat(clinicSchedule.endTime)
    );
    
    if(isStartTimeAhead || clinicSchedule.startTime === clinicSchedule.endTime) {
      this._globalService.showCloseAlert("Start time must not be equal or ahead.");
      return;
    }
    
    this.dismiss(clinicSchedule);
  }

  async onSelectTime(title: string, formControlName: string){
    try {
      const options = {
        component: SelectTimeComponent,
        cssClass: 'select-time-modal',
        swipeToClose: false,
        canDismiss: true,
        backdropDismiss: true,
        componentProps: {
          data: { 
            title,
            time: this.addScheduleForm?.value[formControlName]
          }
        },
      };
      const time = await this._globalService.createModal(options);

      if(time) {
        this.addScheduleForm?.get(formControlName)?.setValue(time);
      }
    } catch(e) {
      console.log(e);
    }
  }
}
