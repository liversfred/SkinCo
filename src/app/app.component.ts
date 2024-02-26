import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SeederService } from './services/seeders/seeder.service';
import { AuthService } from './services/auth.service';
import { PlatformService } from './services/platform.service';
import { GlobalService } from './services/global.service';
import { RouteConstants } from './constants/route.constants';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  isAuthenticated: boolean | undefined;
  routes: any = RouteConstants;
  
  constructor(
    private _seederService: SeederService, 
    private _authService: AuthService, 
    public _platformService: PlatformService, 
    private _globalService: GlobalService
    ) {}

  async ngOnInit() {
    // Start loader
    this._globalService.showLoader();

    if(environment.seedData) {
      await this._seederService.seedAll();

      // Stop loader
      this._globalService.hideLoader();
    }
    else{
      // Subscribe to detect changes in user data
      this._authService.userData.subscribe(async userData => {
        if(!userData) return;
        this.isAuthenticated = await this._authService.checkUserAuth();
      });
      
      // Check if user is logged in
      this.isAuthenticated = await this._authService.checkUserAuth();

      // If not, do not proceed and stop the loader
      if(!this.isAuthenticated) {
        this._globalService.hideLoader();
        return; 
      }

      // If yes, load user data and role
      await this._authService.fetchUserData();

      // Stop loader
      this._globalService.hideLoader();
    }
  }

  async logout(){
    this._globalService.showAlert(
      'Confirm', 
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, 
        {
          text: 'Okay',
          handler: async () => {
            await this._authService.logout();
          }
        }
      ]
    )
  }
}
