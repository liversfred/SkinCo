import { Component, Input, OnInit } from '@angular/core';
import { ClinicSchedule } from 'src/app/models/clinic-schedule.model';
import { Clinic } from 'src/app/models/clinic.model';
import { ClinicScheduleService } from 'src/app/services/clinic-schedule.service';
import { GlobalService } from 'src/app/services/global.service';
import { AddScheduleComponent } from '../../modals/add-schedule/add-schedule.component';
import { TrailService } from 'src/app/services/trail.service';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { ErrorService } from 'src/app/services/error.service';
import { ColorConstants } from 'src/app/constants/color.constants';
import { RefresherCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-clinic-schedule',
  templateUrl: './clinic-schedule.component.html',
  styleUrls: ['./clinic-schedule.component.scss'],
})
export class ClinicScheduleComponent implements OnInit{
  @Input() clinic: Clinic | undefined;
  clinicSchedules: ClinicSchedule[] = [];
  selectedClinicSchedule: ClinicSchedule | undefined;

  constructor(
    private _globalService: GlobalService, 
    private _clinicScheduleService: ClinicScheduleService, 
    private _trailService: TrailService,
    private _errorService: ErrorService
    ) { }

  ngOnInit(): void {
    this.fetchSchedules();
  }

  async fetchSchedules(){
    const clinicId = this.clinic?.id;
    if(!clinicId) return;

    this._globalService.showLoader('Fetching clinic schedules...');
    this.clinicSchedules = await this._clinicScheduleService.fetchClinicSchedulesById(clinicId);
    this._globalService.hideLoader();
  }

  async onRefresh(event: RefresherCustomEvent){
    await this.fetchSchedules();
    event.target.complete();
  }

  onAddSchedule(){
    this.openAddScheduleModal();
  }

  async onUpdateSchedule(){
    const data = {
      clinicSchedule: this.selectedClinicSchedule,
    }

    await this.openAddScheduleModal(data);
  }

  async openAddScheduleModal(data?: any) {
    try {
      const options = {
        component: AddScheduleComponent,
        swipeToClose: false,
        canDismiss: true,
        backdropDismiss: true,
        componentProps: { data },
      };
      
      const schedule = await this._globalService.createModal(options);
      if(!schedule) return;

      // Check if the selected day already exists
      const isDayOfWeekExisting = this.clinicSchedules.some(x => x.dayOfWeek === schedule.dayOfWeek && x.id != data?.clinicSchedule?.id);
      if(isDayOfWeekExisting){
        this._globalService.showErrorAlert("The selected day of the week already exists.")
        return;
      }

      const action = `${data ? ModifierActions.UPDATED : ModifierActions.ADDED} Clinic Schedule`;
      const clinicSchedule: ClinicSchedule = {
        clinicId: this.clinic?.id,
        ...schedule,
        ...(data ? this._trailService.updateAudit(action) : this._trailService.createAudit(action))
      }

      data ? this.updateClinicSchedule(this.selectedClinicSchedule?.id!, clinicSchedule) : this.saveClinicSchedule(clinicSchedule);
    } catch(e) {
      this._errorService.handleError(e);
    }
  }

  async saveClinicSchedule(clinicSchedule: ClinicSchedule){
    await this._clinicScheduleService.saveClinicSchedule(clinicSchedule)
      .then(async (res) => {
        this._globalService.hideLoader();
        if(!res) return;
        await this.fetchSchedules();
        this._globalService.showToast("Schedule has been saved.", 3000, ColorConstants.SUCCESS)
      })
      .catch(e => {
        this._errorService.handleError(e);
      });
  }

  async updateClinicSchedule(id: string, clinicSchedule: ClinicSchedule) {
    clinicSchedule = { id, ...clinicSchedule };

    await this._clinicScheduleService.updateClinicSchedule(clinicSchedule)
      .then(async () => {
        this._globalService.hideLoader()
        await this.fetchSchedules();
        this._globalService.showToast("Clinic schedule has been updated.", 3000, ColorConstants.SUCCESS);
      })
      .catch((e) => {
        this._errorService.handleError(e);
      });
  }

  onDeleteSchedule(){
    this._globalService.showAlert(
      'Confirm', 
      'Are you sure you delete this schedule?',
      [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, 
        {
          text: 'Okay',
          handler: async () => {
            await this.deleteClinicSchedule(this.selectedClinicSchedule?.id!)
          }
        }
      ]
    )
  }
  
  async deleteClinicSchedule(clinicId: string){
    await this._clinicScheduleService.deleteClinicSchedule(clinicId)
      .then(async () => {
        this._globalService.hideLoader()
        await this.fetchSchedules();
        this._globalService.showToast("Clinic schedule has been deleted.", 3000, ColorConstants.SUCCESS);
      })
      .catch((e) => {
        this._errorService.handleError(e);
      });
  }
}
