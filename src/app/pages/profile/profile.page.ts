import { Component } from '@angular/core';
import { ViewDidLeave, ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UpdateProfileComponent } from 'src/app/components/modals/update-profile/update-profile.component';
import { ColorConstants } from 'src/app/constants/color.constants';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { GlobalService } from 'src/app/services/global.service';
import { TrailService } from 'src/app/services/trail.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements ViewWillEnter, ViewDidLeave {
  userData: UserData | undefined | null;
  imagePath: string | undefined;
  userSubs: Subscription | undefined;

  constructor(
    private _authService: AuthService, 
    private _globalService: GlobalService,
    private _trailService: TrailService,
    private _errorService: ErrorService) { }

  ionViewWillEnter(): void {
    this.userSubs = this._authService.userData.subscribe(userData => {
      if(!userData) return;
      
      this.userData = userData;
      this.imagePath = this.userData.person.gender
      this.imagePath = `../../../assets/images/users/default_${this.userData?.person.gender.toLocaleLowerCase()}_user.png`;
    });
  }

  onUpdateProfile() {
    const data = { userData: this.userData }
    
    this.openUpdateProfileModal(data);
  }

  
  async openUpdateProfileModal(data?: any) {
    try {
      const options = {
        component: UpdateProfileComponent,
        swipeToClose: false,
        canDismiss: true,
        backdropDismiss: true,
        componentProps: { data },
      };
      
      const userData = await this._globalService.createModal(options);
      if(!userData || !userData.person) return;

      const fullName = this._globalService.formatFullName(userData.person.firstName, userData.person.middleName, userData.person.lastName);
      const action = `${ModifierActions.UPDATED} User ${fullName}`;
      const updatedUserData: any = {
        id: this.userData?.id,
        person: userData.person,
        ...this._trailService.updateAudit(action)
      }

      this.updateProfile(updatedUserData);
    } catch(e) {
      this._errorService.handleError(e);
    }
  }

  async updateProfile(updatedUserData: UserData) {
    this._globalService.showLoader('Saving profile changes...');

    await this._authService.updateUser(updatedUserData)
      .then(async () => {
        this._globalService.hideLoader()

        await this._authService.fetchUserData();

        this._globalService.showToast(`Record has been updated.`, 3000, ColorConstants.SUCCESS);
      })
      .catch((e) => {
        this._errorService.handleError(e);
      });
  }

  ionViewDidLeave(): void {
    this.userSubs?.unsubscribe();
  }
}
