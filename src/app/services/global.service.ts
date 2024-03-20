import { Injectable } from '@angular/core';
import { AlertButton, AlertController, AlertInput, LoadingController, ModalController, SpinnerTypes, ToastController } from '@ionic/angular';
import { Color } from '../custom-types/colors.type';
import { ToastPosition } from '../custom-types/toast-positions.type';
import { ColorConstants } from '../constants/color.constants';
import { DayOfWeek } from '../constants/day-of-week.constants';
import { AlertTypeEnum } from '../constants/alert-logo.enum';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private isLoading: boolean = false;

  constructor(
    private _loadingCtrl: LoadingController, 
    private _alertCtrl: AlertController, 
    private _toastCtrl: ToastController,
    private _modalCtrl: ModalController
    ) { }

  formatFullName(firstName: string, middleName: string, lastName: string, suffix?: string) {
    const formattedMiddleName = middleName.split(' ')
        .map((part) => `${part.charAt(0)}.`.toUpperCase())
        .join('');

    return `${firstName} ${formattedMiddleName == '.' ? '' : formattedMiddleName} ${lastName} ${suffix ? suffix : ''}`.toUpperCase();
  }
  
  showLoader(msg?: string, spinner?: SpinnerTypes ) {
    if(this.isLoading) return;
    this.isLoading = true;

    return this._loadingCtrl.create({
      message: msg,
      spinner: spinner ?? 'lines-sharp'
    }).then(res => {
      res.present().then(() => {
        console.log('Loader showed.')

        if(!this.isLoading) {
          res.dismiss().then(() => {});
        }
      })
    });
  }
  
  hideLoader() {
    if(!this.isLoading) return;
    this.isLoading = false;

    return this._loadingCtrl.dismiss()
    .then(() => console.log('Loader dismissed.'))
    .catch(e => console.log('Error hiding the loader: ', e));
  }

  showAlert(header: AlertTypeEnum, message: string, buttons?: AlertButton[], inputs?: AlertInput[]) {
    const formattedMessage = `<div class="alert-modal">
                                <div class="ion-text-center ion-padding">
                                  <ion-img class="alert-logo" src="../../assets/logos/${header.toLowerCase()}.png"></ion-img>
                                </div>
                                <div class="ion-text-center ion-margin-top">
                                  <ion-label>
                                    ${message}
                                  </ion-label>
                                </div>
                              </div>`;

    this._alertCtrl.create({
      header,
      message: formattedMessage,
      inputs: inputs ? inputs : [],
      buttons: buttons ? buttons : ['Okay']
    })
    .then(alertEl => alertEl.present());
  }

  showCloseAlert(message: string, header: AlertTypeEnum = AlertTypeEnum.ERROR){
    this.showAlert(header, message, 
      [
        {
          text: 'Close',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ]);
  }

  showToast(message: string, duration = 3000, color: Color = ColorConstants.DANGER, position?: ToastPosition) {
    this._toastCtrl.create({
      message: message,
      duration: duration,
      color: color,
      position: position,
      cssClass: 'toast-text'
    }).then(toastEl => toastEl.present())
  }
  
  async createModal(options: any) {
    const modal = await this._modalCtrl.create(options);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data) return data;
  }
  
  dismissModal(val?: any) {
    let data: any = val ? val : null;
    this._modalCtrl.dismiss(data);
  }

  sortData(sort: any, data: any){
    if (!sort.active || sort.direction === '') return data;
    
    return data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'baseName':
          return this.compare(a.name.toLowerCase(), b.name.toLowerCase(), isAsc);
        case 'modifier':
          return this.compare(a.modifier.toLowerCase(), b.modifier.toLowerCase(), isAsc);
        case 'modifierAction':
          return this.compare(a.modifierAction.toLowerCase(), b.modifierAction.toLowerCase(), isAsc);
        case 'fullName':
          return this.compare(a.person.fullName.toLowerCase(), b.person.fullName.toLowerCase(), isAsc);
        case 'bookingDate':
          return this.compare(a.bookingDate, b.bookingDate, isAsc);
        case 'createdAt':
          return this.compare(a.createdAt, b.createdAt, isAsc);
        case 'updatedAt':
          return this.compare(a.updatedAt, b.updatedAt, isAsc);
        case 'dayOfWeek':
          return this.compare(this.getDayOfWeekValue(a.dayOfWeek), this.getDayOfWeekValue(b.dayOfWeek), isAsc);
        default:
          return 0;
      }
    });
  }
  
  getDayOfWeekValue(dayOfWeek: string): number {
    switch (dayOfWeek) {
      case DayOfWeek.MONDAY:
        return 1;
      case DayOfWeek.TUESDAY:
        return 2;
      case DayOfWeek.WEDNESDAY:
        return 3;
      case DayOfWeek.THURSDAY:
        return 4;
      case DayOfWeek.FRIDAY:
        return 5;
      case DayOfWeek.SATURDAY:
        return 6;
      case DayOfWeek.SUNDAY:
        return 0;
      default:
        return -1;
    }
  }
  
  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  getCurrentTime(): string{
    const dateTime = new Date();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    return `${this.padZero(hours)}:${this.padZero(minutes)}`;
  }

  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  convertTo12HourFormat(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
  
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  convertToMilitaryFormat(time: string): string {
    const [timePart, ampmPart] = time.split(' ');
    const [hoursStr, minutesStr] = timePart.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
  
    let militaryHours = hours;
    if (ampmPart.toLowerCase() === 'pm' && hours < 12) {
      militaryHours += 12; 
    } else if (ampmPart.toLowerCase() === 'am' && hours === 12) {
      militaryHours = 0;
    }
  
    return `${String(militaryHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  convertMilitaryToDateFormat(militaryTime: string): Date {
    const [hourString, minuteString] = militaryTime.split(":");
    const date = new Date();
    date.setHours(parseInt(hourString), parseInt(minuteString), 0, 0);
    return date;
  }

  isStartTimeAhead(startTime: string, endTime: string): boolean {
    const startTimeParts = startTime.split(':').map(Number);
    const endTimeParts = endTime.split(':').map(Number);
  
    const startDate = new Date();
    startDate.setHours(startTimeParts[0], startTimeParts[1], 0);
  
    const endDate = new Date();
    endDate.setHours(endTimeParts[0], endTimeParts[1], 0);
  
    return startDate.getTime() > endDate.getTime();
  }

  checkIfDatesAreEqual(date1: Date, date2: Date): boolean{
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const day1 = date1.getDate();

    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();

    return year1 === year2 && month1 === month2 && day1 === day2;
  }
}
