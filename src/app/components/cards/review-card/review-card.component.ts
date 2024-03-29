import { Component, Input, OnInit } from '@angular/core';
import { Booking } from 'src/app/models/booking-details.model';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss'],
})
export class ReviewCardComponent  implements OnInit {
  @Input() bookingWithReview: Booking | undefined;
  fullname: string | undefined;
  imagePath: string| undefined;
  
  constructor(private _globalService: GlobalService) { }

  ngOnInit() {
    this.imagePath = `../../../../../assets/images/users/default_${this.bookingWithReview?.patient?.person.gender.toLocaleLowerCase()}_user.png`;

    if(!this.bookingWithReview?.review?.isAnonymous){
      this.fullname = this._globalService.formatFullName(
        this.bookingWithReview?.patient?.person.firstName!,
        this.bookingWithReview?.patient?.person.middleName!,
        this.bookingWithReview?.patient?.person.lastName!,
      )
    }
  }

  
  getStarsArray(rating: number | undefined): number[] {
    if (!rating) {
      return [];
    }
    return Array.from({ length: Math.floor(rating) }, (_, i) => i);
  }
}
