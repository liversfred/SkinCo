import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { ProfileCardComponent } from '../cards/profile-card/profile-card.component';



@NgModule({
  declarations: [
    ProfileDetailsComponent,
    ProfileCardComponent
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    ProfileDetailsComponent,
    ProfileCardComponent
  ]
})
export class ProfileModule { }
