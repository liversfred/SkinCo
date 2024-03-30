import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColorConstants } from 'src/app/constants/color.constants';
import { Doctor } from 'src/app/models/doctor.model';
import { UserData } from 'src/app/models/user-data.model';
import { ErrorService } from 'src/app/services/error.service';
import { GlobalService } from 'src/app/services/global.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-doctor-card',
  templateUrl: './doctor-card.component.html',
  styleUrls: ['./doctor-card.component.scss'],
})
export class DoctorCardComponent implements OnInit{
  @Input() doctor: Doctor | undefined;
  @Input() viewOnly: boolean = false;
  @Input() patient: UserData | undefined;
  @Output() updateDoctor = new EventEmitter<void>;
  imagePath: string = "";

  constructor(private _userService: UserService, private _globalService: GlobalService, private _errorService: ErrorService) { }

  ngOnInit(): void {
    this.imagePath = `../../../assets/images/doctors/default_${this.doctor?.person.gender.toLocaleLowerCase()}_doctor.png`;
  }

  onUpdateDoctor(){
    this.updateDoctor.emit();
  }

  async onToggleFavorite(event: boolean){
    if(!this.patient || !this.doctor) return;
    let value = null

    if(event) value = this.doctor?.id!

    await this.updateFavoriteDoctor(value);

    event ? this._globalService.showToast("Added to favorites.", 3000, ColorConstants.SUCCESS) :
            this._globalService.showToast("Removed from favorites.", 3000, ColorConstants.SUCCESS);
  }

  async updateFavoriteDoctor(value: string | null) {
    if (this.patient === undefined)  return;

    this.patient.favoriteDoctorId = value;
    const updatedModel = {
      id: this.patient.id,
      favoriteDoctorId: value
    };

    await this._userService.updateUserData(updatedModel);
  }
}
