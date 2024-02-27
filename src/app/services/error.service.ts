import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private _globalService: GlobalService) { }

  handleError(err: any, customeMessage?: string){
    this._globalService.hideLoader();
    let errorMessage: string = customeMessage ?? `An error occurred: ${err.code}`;
    this._globalService.showToast(errorMessage);
  }
}
