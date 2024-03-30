import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Booking } from 'src/app/models/booking-details.model';
import { CommentService } from 'src/app/services/comment.service';
import { GlobalService } from 'src/app/services/global.service';
import { AddCommentComponent } from '../../modals/add-comment/add-comment.component';
import { ErrorService } from 'src/app/services/error.service';
import { Roles } from 'src/app/constants/roles.constants';
import { UserData } from 'src/app/models/user-data.model';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { CommentData } from 'src/app/models/comment-data.model';
import { TrailService } from 'src/app/services/trail.service';
import { ColorConstants } from 'src/app/constants/color.constants';
import { AlertTypeEnum } from 'src/app/constants/alert-logo.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss'],
})
export class ReviewCardComponent  implements OnInit, OnDestroy {
  @Input() userData: UserData | undefined;
  @Input() users: UserData[] = [];
  @Input() bookingWithReview: Booking | undefined;
  fullname: string | undefined;
  imagePath: string| undefined;
  roles: any = Roles;
  comments: CommentData[] = [];
  showComments: boolean = false;
  commentsSubs: Subscription | undefined;
  
  constructor(
    private _globalService: GlobalService, 
    private _commentService: CommentService,
    private _errorService: ErrorService,
    private _trailService: TrailService
    ) { }

  ngOnInit() {
    this.fetchComments();

    this.imagePath = `../../../../../assets/images/users/default_${this.bookingWithReview?.patient?.person.gender.toLocaleLowerCase()}_user.png`;

    if(!this.bookingWithReview?.review?.isAnonymous){
      this.fullname = this._globalService.formatFullName(
        this.bookingWithReview?.patient?.person.firstName!,
        this.bookingWithReview?.patient?.person.middleName!,
        this.bookingWithReview?.patient?.person.lastName!,
      )
    }
  }

  fetchComments(){
    this.commentsSubs = this._commentService.fetchCommentsAsync(this.bookingWithReview?.id!).subscribe(comments => {
      this.comments = comments.map((comment: CommentData) => {
        return {
          ...comment,
          user: this.users.find(x => x.id === comment.userId),
        };
      });
    })
  }
  
  getStarsArray(rating: number | undefined): number[] {
    if (!rating) {
      return [];
    }
    return Array.from({ length: Math.floor(rating) }, (_, i) => i);
  }

  async toggleComments(){
    this.showComments = !this.showComments;
  }

  onAddComment(){
    const data = { booking: this.bookingWithReview };
    this.openCommentModal(data);
  }

  onUpdateComment(commentData: CommentData){
    const data = { booking: this.bookingWithReview, comment: commentData};
    this.openCommentModal(data);
  }

  onDeleteComment(commentData: CommentData){
    this._globalService.showAlert(
      AlertTypeEnum.CONFIRM, 
      'Are you sure you want to delete this comment?',
      [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, 
        {
          text: 'Okay',
          handler: async () => {
            const action = `${ModifierActions.ARCHIVED} Comment from booking review ${commentData.booking?.bookingNo}`;

            const updatedModel = {
              id: commentData.id!,
            ...this._trailService.deleteAudit(action)
            };

            this.deleteComment(updatedModel);
          }
        }
      ]
    );
  }

  async openCommentModal(data: any) {
    try {
      const options = {
        component: AddCommentComponent,
        swipeToClose: false,
        canDismiss: true,
        backdropDismiss: true,
        componentProps: { data },
      };
      
      const commentDataRes = await this._globalService.createModal(options);

      if(!commentDataRes) return;

      const action = `${data.comment ? ModifierActions.UPDATED : ModifierActions.CREATED} Comment to Booking ${data.booking.id}`;
      const commentData: CommentData = {
        ...commentDataRes,
        userId: this.userData?.id,
        parentId: data.booking.id,
        ...(data.comment ? this._trailService.updateAudit(action) : this._trailService.createAudit(action))
      };

      data.comment ? this.updateComment(data.comment.id, commentData) : this.saveComment(commentData);
    } catch(e) {
      this._errorService.handleError(e);
    }
  }

  async saveComment(commentData: CommentData){
    this._globalService.showLoader('Saving comment...');

    await this._commentService.saveComment(commentData)
      .then(async () => {
        this._globalService.hideLoader();
        this._globalService.showToast(`Comment posted..`, 3000, ColorConstants.SUCCESS);
      })
      .catch((e) => {
        this._errorService.handleError(e);
      });
  }

  async updateComment(id: string, commentData: CommentData){
    this._globalService.showLoader('Updating comment...');
    commentData = {id, ...commentData };
    
    await this._commentService.updateComment(commentData)
      .then(async () => {
        this._globalService.hideLoader();
        this._globalService.showToast(`Comment updated..`, 3000, ColorConstants.SUCCESS);
      })
      .catch((e) => {
        this._errorService.handleError(e);
      });
  }

  async deleteComment(updatedModel: any){
    this._globalService.showLoader('Deleting comment...');
    
    await this._commentService.updateComment(updatedModel)
      .then(async () => {
        this._globalService.hideLoader();
        this._globalService.showToast(`Comment deleted..`, 3000, ColorConstants.SUCCESS);
      })
      .catch((e) => {
        this._errorService.handleError(e);
      });
  }

  ngOnDestroy(): void {
    this.commentsSubs?.unsubscribe();
  }
}
