import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormConstants } from 'src/app/constants/form.constants';
import {  CommentData } from 'src/app/models/comment-data.model';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss'],
})
export class AddCommentComponent  implements OnInit {
  @Input() data: any;
  commentForm: FormGroup | undefined;
  commentMaxLengh: number = FormConstants.commentMaxLength;

  constructor(private _globalService: GlobalService) { }

  ngOnInit() {
    this.initializeFormGroup();
  }

  initializeFormGroup(){
    this.commentForm = new FormGroup({
      isAnonymous: new FormControl(false),
      comment: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.commentMaxLengh)] }),
    });

    if(this.data?.comment) {
      const CommentData: CommentData = this.data.comment;
      this.commentForm?.get('isAnonymous')?.setValue(CommentData.isAnonymous);
      this.commentForm?.get('comment')?.setValue(CommentData.comment);
    }
  }
  
  dismiss(val?: any) {
    this._globalService.dismissModal(val);
  }

  done(){
    if(this.commentForm?.invalid) {
      this._globalService.showCloseAlert("Please fill in all the fields.");
      return;
    }

    const comment: any = {
      isAnonymous: this.commentForm?.value.isAnonymous,
      comment: this.commentForm?.value.comment.trim()
    } 
    
    this.dismiss(comment);
  }
}
