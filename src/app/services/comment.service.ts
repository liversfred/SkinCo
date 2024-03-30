import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { GlobalService } from './global.service';
import { Collections } from '../constants/collections.constants';
import { Observable, map } from 'rxjs';
import { CommentData } from '../models/comment-data.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private commentsCollection: CollectionReference<DocumentData>;

  constructor(private _fireStore: Firestore, private _globalService: GlobalService) {
    this.commentsCollection = collection(this._fireStore, Collections.COMMENTS);
  }

  async saveComment(commentData: CommentData): Promise<string>{
    try{
      const res = await addDoc(this.commentsCollection, commentData);
      return res.id;
    }catch(e) {
      throw(e);
    }
  }
   
  async updateComment(updatedModel: any): Promise<void> {
    try{
      const docInstance = doc(this._fireStore, Collections.COMMENTS, updatedModel.id);
      await updateDoc(docInstance, updatedModel)
    }catch(e) {
      throw(e);
    }
  }

  async fetchComments(bookingId: string): Promise<CommentData[]> {
    try{
      let comments = await new Promise<CommentData[]>((resolve, reject) => {
        this.fetchCommentsAsync(bookingId)
          .subscribe({
            next: (comments: CommentData[]) => {
              resolve(comments);
            },
            error: (err: any) => {
              reject(err);
            }
          });
      });

      return comments;
    }catch(e) {
      console.log(`Error occurred: ${e}`);
      return [];
    }
  }

  fetchCommentsAsync(bookingId: string): Observable<CommentData[]> {
    let collectionRef = query(this.commentsCollection, 
        where('isActive', '==', true),
        where('parentId', '==', bookingId)
      );
    
    return collectionData(collectionRef, { idField: 'id'})
      .pipe(
        map((comments: any[]) => {
          return comments.map((item) => {
            return { 
              ...item, 
              createdAt: item.createdAt.toDate(),
              updatedAt: item.updatedAt.toDate(),
            };
          });
        }),
        map((comments: CommentData[]) => this._globalService.sortData({active: 'createdAt', direction: 'asc'}, comments)),
      );
  }
}
