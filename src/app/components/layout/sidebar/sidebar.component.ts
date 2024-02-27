import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Roles } from 'src/app/constants/roles.constants';
import { RouteConstants } from 'src/app/constants/route.constants';
import { UserData } from 'src/app/models/user-data.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() isAuthenticated: boolean | undefined;
  @Input() userData: UserData | undefined;
  @Output() logout = new EventEmitter<void> 
  routes: any = RouteConstants;
  roles: any = Roles;

  constructor() { }

  onLogout() {
    this.logout.emit();
  }

}
