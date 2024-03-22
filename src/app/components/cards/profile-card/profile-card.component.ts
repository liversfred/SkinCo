import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserData } from 'src/app/models/user-data.model';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent  implements OnInit {
  @Input() userData: UserData | null | undefined;
  @Input() viewOnly: boolean = false;
  imagePath: string| undefined;
  @Output() updateProfile = new EventEmitter<void>
  
  constructor() { }

  ngOnInit() {
    this.imagePath = this.userData?.person.gender
    this.imagePath = `../../../../../assets/images/users/default_${this.userData?.person.gender.toLocaleLowerCase()}_user.png`;
  }

  onUpdateProfile(){
    this.updateProfile.emit();
  }

}
