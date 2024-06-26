import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClinicSchedule } from 'src/app/models/clinic-schedule.model';
import { ClinicServiceData } from 'src/app/models/clinic-service-data.model';
import { Clinic } from 'src/app/models/clinic.model';
import { Doctor } from 'src/app/models/doctor.model';
import { ClinicScheduleService } from 'src/app/services/clinic-schedule.service';
import { ClinicServicesService } from 'src/app/services/clinic-services.service';
import { GlobalService } from 'src/app/services/global.service';
import { SelectDateComponent } from '../select-date/select-date.component';
import { FormConstants } from 'src/app/constants/form.constants';
import { AlertTypeEnum } from 'src/app/constants/alert-logo.enum';
import { Booking } from 'src/app/models/booking-details.model';
import { UserData } from 'src/app/models/user-data.model';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  @Input() data: any;
  clinic: Clinic | undefined;
  userData: UserData | undefined;
  booking: Booking | undefined;
  bookingForm: FormGroup | undefined;
  clinicSchedules: ClinicSchedule[] = [];
  clinicServices: ClinicServiceData[] = [];
  clinicDoctors: Doctor[] = [];
  selectedClinicServices: ClinicServiceData[] = [];
  totalServicesPrice: number = 0;
  bookingRemarksMaxLength: number = FormConstants.bookingRemarksMaxLength;

  constructor(
    private _globalService: GlobalService, 
    private _clinicServicesService: ClinicServicesService,
    private _clinicScheduleService: ClinicScheduleService
    ) { }

  async ngOnInit() {
    this.clinic = this.data.clinic;
    this.userData = this.data.userData;

    this._globalService.showLoader('Preparing the form...');

    this.initializeFormGroup();

    await this.fetchClinicSchedules();
    await this.fetchClinicServices();

    this._globalService.hideLoader();
  }

  async fetchClinicSchedules(){
    this.clinicSchedules = await this._clinicScheduleService.fetchClinicSchedulesById(this.clinic?.id!);
  }

  async fetchClinicServices(){
    this.clinicServices = await this._clinicServicesService.fetchClinicServices(this.clinic?.id!);
  }

  initializeFormGroup(){
    this.bookingForm = new FormGroup({
      bookingDate: new FormControl(null, { validators: [Validators.required] }),
      clinicServiceIds: new FormControl(null, { validators: [Validators.required] }),
      remarks: new FormControl('', { validators: [Validators.maxLength(this.bookingRemarksMaxLength)] })
    });

    if(this.data?.booking) {
      this.booking = this.data.booking;
      this.bookingForm?.get('bookingDate')?.setValue(this.booking?.bookingDate);
      this.bookingForm?.get('clinicServiceIds')?.setValue(this.booking?.clinicServiceIds);
      this.bookingForm?.get('remarks')?.setValue(this.booking?.remarks);
      this.selectedClinicServices = this.booking?.clinicServices ?? [];

      // Enable only booking date field
      this.bookingForm.get('clinicServiceIds')?.disable();
      this.bookingForm.get('remarks')?.disable();
    }
  }
  
  async onSelectDate(){
    try {
      const options = {
        component: SelectDateComponent,
        cssClass: 'select-date-modal',
        swipeToClose: false,
        canDismiss: true,
        backdropDismiss: true,
        componentProps: {
          data: { 
            title: "Select Date",
            userData: this.userData,
            clinic: this.clinic,
            clinicSchedules: this.clinicSchedules,
            bookingDate: this.bookingForm?.value.bookingDate
          }
        },
      };
      const date = await this._globalService.createModal(options);

      if(!date) return;

      this.bookingForm?.get('bookingDate')?.setValue(date);
    } catch(e) {
      console.log(e);
    }
  }
  
  dismiss(val?: any) {
    this._globalService.dismissModal(val);
  }

  onClinicServicesChanged(){
    this.selectedClinicServices = [];
    this.totalServicesPrice = 0;
    const clinicServiceIds = this.bookingForm?.value.clinicServiceIds;
    if(!clinicServiceIds) return;

    clinicServiceIds.forEach((id: string) => {
      const clinicService = this.clinicServices.find(x => x.id === id);
      if(clinicService) {
        this.selectedClinicServices.push(clinicService);
        this.totalServicesPrice += clinicService.price;
      }
    });
  }

  generateRandomBookingNumber(): string {
    const timestamp = Date.now().toString(36); // Convert timestamp to base 36 string
    const randomString = Math.random().toString(36).substring(2, 6); // Generate random string
    return (timestamp + randomString).toUpperCase();
  }

  done(){
    if(this.bookingForm?.invalid) {
      this._globalService.showCloseAlert("Please fill in all the fields.");
      return;
    }

    this._globalService.showAlert(
      AlertTypeEnum.CONFIRM, 
      'Arey you sure you want to submit?',
      [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, 
        {
          text: 'Submit',
          handler: () => {
            const booking = this.data.booking ? this.getRescheduleModel() : this.getNewBookingModel();
        
            this.dismiss(booking);
          }
        }
      ]
    )
  }
  
  getNewBookingModel(){
    return {
      bookingNo: this.generateRandomBookingNumber(),
      bookingDate: new Date(this.bookingForm?.value.bookingDate),
      clinicId: this.clinic?.id!,
      clinicServiceIds: this.bookingForm?.value.clinicServiceIds,
      remarks: this.bookingForm?.value.remarks,
      clinicServices: this.clinicServices.filter(x => this.bookingForm?.value.clinicServiceIds.includes(x.id))
    };
  }

  getRescheduleModel(){
    return {
      bookingDate: new Date(this.bookingForm?.value.bookingDate)
    };
  }
}
