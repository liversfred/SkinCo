import { Injectable } from '@angular/core';
import { Trail } from '../models/trail.model';
import { AuthService } from './auth.service';
import { UserData } from '../models/user-data.model';

@Injectable({
  providedIn: 'root'
})
export class TrailService {
  private user: UserData | undefined | null;

  constructor(private _authService: AuthService) { 
    this._authService.userData.subscribe(user => this.user = user);
  }

  createAudit(action: string, exclueActiveStatus: boolean = false): Trail{
    const currentDate = new Date();
    let trail: Trail = {
      createdAt: currentDate,
      updatedAt: currentDate,
      modifier: this.getModifier(),
      modifierAction: action
    };

    if(!exclueActiveStatus) trail = { ...trail, isActive: true };
    return trail;
  }

  updateAudit(action: string): Trail{
    return{
      updatedAt: new Date(),
      modifier: this.getModifier(),
      modifierAction: action,
    }
  }

  deleteAudit(action: string): Trail{
    return{
      updatedAt: new Date(),
      modifier: this.getModifier(),
      modifierAction: action,
      isActive: false
    }
  }

  getModifier(){
    return this.user ? `${this.user?.person?.firstName} ${this.user?.person?.lastName}` : 'Super Admin';
  }
}
