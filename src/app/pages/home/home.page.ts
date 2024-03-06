import { Component } from '@angular/core';
import { RefresherCustomEvent, ViewDidLeave, ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements ViewWillEnter, ViewDidLeave{

  constructor() { }
  
  ionViewWillEnter(): void {
    console.log("ionViewWillEnter - Home");
  }
  
  async onRefresh(event: RefresherCustomEvent){
    event.target.complete();
  }

  ionViewDidLeave(): void {
    console.log("ionViewDidLeave - Home");
  }
}
