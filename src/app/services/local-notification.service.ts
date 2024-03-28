import { Injectable } from '@angular/core';
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationService {
  notificationid: number = 1;

  constructor() { }
  
  async initialize(){
    let permissions = await LocalNotifications.checkPermissions();

    if (permissions.display === 'prompt') {
      permissions = await LocalNotifications.requestPermissions();
    }

    if (permissions.display !== 'granted') {
      throw new Error('User denied permissions!');
    }
  }

  async scheduleNotification(options: ScheduleOptions){
    try{
      await LocalNotifications.schedule(options);

      this.notificationid++;
    }
    catch(ex){
      console.log(ex);
    }
  }
}
