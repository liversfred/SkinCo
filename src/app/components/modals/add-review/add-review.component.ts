import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormConstants } from 'src/app/constants/form.constants';
import { Review } from 'src/app/models/review.model';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss'],
})
export class AddReviewComponent  implements OnInit {
  @Input() data: any;
  reviewForm: FormGroup | undefined;
  commentMaxLengh: number = FormConstants.commentMaxLength;

  constructor(private _globalService: GlobalService) { }

  ngOnInit() {
    this.initializeFormGroup();
  }

  initializeFormGroup(){
    this.reviewForm = new FormGroup({
      isAnonymous: new FormControl(false),
      rating: new FormControl('', { validators: [Validators.required, Validators.min(1), Validators.max(5)] }),
      remarks: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.commentMaxLengh)] }),
    });

    if(this.data?.review) {
      const review: Review = this.data.review;
      this.reviewForm?.get('isAnonymous')?.setValue(review.isAnonymous);
      this.reviewForm?.get('rating')?.setValue(review.rating);
      this.reviewForm?.get('remarks')?.setValue(review.remarks);
    }
  }
  
  dismiss(val?: any) {
    this._globalService.dismissModal(val);
  }

  done(){
    if(this.reviewForm?.invalid) {
      this._globalService.showCloseAlert("Please fill in all the fields.");
      return;
    }

    const review: any = {
      isAnonymous: this.reviewForm?.value.isAnonymous,
      rating: parseInt(this.reviewForm?.value.rating),
      remarks: this.reviewForm?.value.remarks.trim()
    } 
    
    this.dismiss(review);
  }
}
