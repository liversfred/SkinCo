import { Injectable } from '@angular/core';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private _redirect = new BehaviorSubject<any>(null);
  private fcm_token = 'push_notification_token';

  get redirect() {
    return this._redirect.asObservable();
  }

  constructor(
    private _storageService: StorageService
  ) { }

  initialize(){
    if(Capacitor.getPlatform() !== 'web') {
      this.registerPushNotification();
    }
  }

  private async registerPushNotification() {
    try {
      this.addListeners();
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }

      await PushNotifications.register();
    } catch(e) {
      console.log(e);
    }
  }
  
  addListeners() {
    PushNotifications.addListener('registration', async(token: Token) => {
        const fcm_token = (token?.value);
        let go = 1;
        const saved_token = JSON.parse((await this._storageService.getStorage(this.fcm_token)).value ?? "");

        if(saved_token) {
          go = fcm_token == saved_token ? 0 : 2;
        }
        
        if(go == 1) {
          // Save token
          this._storageService.setStorage(this.fcm_token, JSON.stringify(fcm_token));
        } else if(go == 2) {
          // Update token
          this._storageService.setStorage(this.fcm_token, fcm_token);
        }
      }
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {
        const data = notification?.data;
        if(data?.redirect) this._redirect.next(data?.redirect);
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed', async (notification:ActionPerformed) => {
        const data = notification.notification.data;
        if(data?.redirect) this._redirect.next(data?.redirect);
      }
    );
  }

  async removeFcmToken() {
    try {
      const token = (await this._storageService.getStorage(this.fcm_token)).value;
      if(!token) return;

      const saved_token = JSON.parse(token);
      this._storageService.removeStorage(saved_token);
    } catch(e) {
      console.log(e);
      throw(e);
    }

  }
}
