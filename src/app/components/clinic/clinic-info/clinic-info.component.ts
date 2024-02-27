import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Clinic } from 'src/app/models/clinic.model';
import { UserData } from 'src/app/models/user-data.model';

@Component({
  selector: 'app-clinic-info',
  templateUrl: './clinic-info.component.html',
  styleUrls: ['./clinic-info.component.scss'],
})
export class ClinicInfoComponent {
  @Input() clinic: Clinic | undefined;
  @Input() userData: UserData | undefined;
  @Output() updateInfo = new EventEmitter<void>;

  constructor() { }

  onUpdateInfo(){
    this.updateInfo.emit();
  }
}
