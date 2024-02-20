import { Injectable } from '@angular/core';
import { AlertButton, AlertController, AlertInput, LoadingController, SpinnerTypes, ToastController, ToastOptions } from '@ionic/angular';
import { Color } from '../custom-types/colors.type';
import { ToastPosition } from '../custom-types/toast-positions.type';
import { ColorConstants } from '../constants/color.constants';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private isLoading: boolean = false;

  constructor(private _loadingCtrl: LoadingController, private _alertCtrl: AlertController, private _toastCtrl: ToastController) { }

  formatFullName(firstName: string, middleName: string, lastName: string, suffix?: string) {
    const formattedMiddleName = middleName.split(' ')
        .map((part) => `${part.charAt(0)}.`.toUpperCase())
        .join('');

    return `${firstName} ${formattedMiddleName == '.' ? '' : formattedMiddleName} ${lastName} ${suffix ? suffix : ''}`.toUpperCase();
  }
  
  showLoader(msg?: string, spinner?: SpinnerTypes ) {
    if(!this.isLoading) this.setLoader();

    return this._loadingCtrl.create({
      message: msg,
      spinner: spinner ?? 'lines-sharp'
    }).then(res => {
      res.present().then(() => {
        if(!this.isLoading) {
          res.dismiss().then(() => {});
        }
      })
    });
  }
  
  hideLoader() {
    if(this.isLoading) this.setLoader();

    return this._loadingCtrl.dismiss();
  }

  private setLoader() {
    this.isLoading = !this.isLoading;
  }

  showAlert(header: string, message: string, buttons?: AlertButton[], inputs?: AlertInput[]) {
    this._alertCtrl.create({
      header: header ? header : 'Authentication failed',
      message: message,
      inputs: inputs ? inputs : [],
      buttons: buttons ? buttons : ['Okay']
    })
    .then(alertEl => alertEl.present());
  }

  showToast(message: string, duration = 3000, color: Color = ColorConstants.DANGER, position?: ToastPosition) {
    this._toastCtrl.create({
      message: message,
      duration: duration,
      color: color,
      position: position
    }).then(toastEl => toastEl.present())
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
        case 'createdAt':
          return this.compare(a.createdAt, b.createdAt, isAsc);
        case 'updatedAt':
          return this.compare(a.updatedAt, b.updatedAt, isAsc);
        default:
          return 0;
      }
    });
  }
  
  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
