import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouteConstants } from 'src/app/constants/route.constants';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() isAuthenticated: boolean | undefined;
  @Output() logout = new EventEmitter<boolean> 
  routes: any = RouteConstants;

  constructor() { }

  onLogout() {
    this.logout.emit(true);
  }

}
