import { Component, OnDestroy, ViewChild } from '@angular/core';
import { IonContent, ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Roles } from 'src/app/constants/roles.constants';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements ViewWillEnter, OnDestroy{
  userData: UserData | undefined;
  roles: any = Roles;
  userSubs: Subscription | undefined;
  @ViewChild('content') content: IonContent | undefined;

  constructor(
    private _authService: AuthService,
    ) { }

  async ionViewWillEnter(): Promise<void> {
    // Load user data
    this.userSubs = this._authService.userData.subscribe(async userData => this.userData = userData ?? undefined );
  }

  scrollToTop() {
    this.content?.scrollToTop();
  }

  ngOnDestroy(): void {
    this.userSubs?.unsubscribe();
  }
}
