import { Injectable } from '@angular/core';
import { Trail } from '../models/trail.model';

@Injectable({
  providedIn: 'root'
})
export class TrailService {

  constructor() { }

  createAudit(action: string, exclueActiveStatus: boolean = false): Trail{
    const currentDate = new Date();
    let trail: Trail = {
      createdAt: currentDate,
      updatedAt: currentDate,
      modifier: "Admin",
      modifierAction: action
    };

    if(!exclueActiveStatus) trail = { ...trail, isActive: true };
    return trail;
  }
}
