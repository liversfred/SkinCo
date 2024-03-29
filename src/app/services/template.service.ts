import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { GlobalService } from './global.service';
import { Collections } from '../constants/collections.constants';
import { Observable, map } from 'rxjs';
import { Template } from '../models/template.model';
import { TemplateType } from '../constants/template-types.constants';
import { UserData } from '../models/user-data.model';
import { TemplateDefault } from '../constants/template-dafault.constants';
import { TrailService } from './trail.service';
import { ModifierActions } from '../constants/modifiers-action.constants';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private templatessCollection: CollectionReference<DocumentData>;

  constructor(private _fireStore: Firestore, private _globalService: GlobalService, private _trailService: TrailService) {
    this.templatessCollection = collection(this._fireStore, Collections.TEMPLATES);
  }

  async saveTemplate(template: Template): Promise<string>{
    try{
      const res = await addDoc(this.templatessCollection, template);
      return res.id;
    }catch(e) {
      throw(e);
    }
  }
   
  async updateTemplate(updatedModel: any): Promise<void> {
    try{
      const docInstance = doc(this._fireStore, Collections.TEMPLATES, updatedModel.id);
      await updateDoc(docInstance, updatedModel)
    }catch(e) {
      throw(e);
    }
  }

  getTemplateByType(templates: Template[], templateType: TemplateType){
    return templates.find(x => x.templateType === templateType);
  }

  async fetchTemplates(userData: UserData, clinicId: string): Promise<Template[]> {
    try{
      let templates = await new Promise<Template[]>((resolve, reject) => {
        this.fetchTemplatesAsync(clinicId)
          .subscribe({
            next: (templates: Template[]) => {
              resolve(templates);
            },
            error: (err: any) => {
              reject(err);
            }
          });
      });

      const emailTemplate = templates.find(x => x.templateType === TemplateType.EMAIL);

      if(!emailTemplate) {
        const fullName = this._globalService.formatFullName(userData.person?.firstName!, userData?.person?.middleName!, userData?.person?.lastName!);
        const defaultTemplate: any = {
          clinicId: clinicId,
          templateType: TemplateType.EMAIL,
          content: TemplateDefault.EMAIL,
          ...this._trailService.createAudit(`${ModifierActions.UPDATED} Template ${fullName}`, true)
        }
        templates.push(defaultTemplate);
      }

      return templates;
    }catch(e) {
      console.log(`Error occurred: ${e}`);
      return [];
    }
  }

  fetchTemplatesAsync(clinicId?: string): Observable<Template[]> {
    let collectionRef = query(this.templatessCollection, where('clinicId', '==', clinicId));
    
    return collectionData(collectionRef, { idField: 'id'})
      .pipe(
        map((templates: any[]) => {
          return templates.map((item) => {
            return { 
              ...item, 
              createdAt: item.createdAt.toDate(),
              updatedAt: item.updatedAt.toDate(),
            };
          });
        }),
        map((templates: Template[]) => this._globalService.sortData({active: 'createdAt', direction: 'asc'}, templates)),
      );
  }
}
