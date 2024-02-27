import { Component } from '@angular/core';
import { ViewDidLeave, ViewWillEnter } from '@ionic/angular';

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

  ionViewDidLeave(): void {
    console.log("ionViewDidLeave - Home");
  }
}
