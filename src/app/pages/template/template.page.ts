import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ColorConstants } from 'src/app/constants/color.constants';
import { Roles } from 'src/app/constants/roles.constants';
import { RouteConstants } from 'src/app/constants/route.constants';
import { Template } from 'src/app/models/template.model';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { GlobalService } from 'src/app/services/global.service';
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.page.html',
  styleUrls: ['./template.page.scss'],
})
export class TemplatePage implements OnInit, OnDestroy {
  userData: UserData | undefined;
  templates: Template[] = [];
  userDataSubs: Subscription | undefined;
  templateSubs: Subscription | undefined;

  constructor(
    private _authService: AuthService, 
    private _templateService: TemplateService,
    private _globalService: GlobalService,
    private _errorService: ErrorService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._globalService.showLoader('Page loading...');

    // Load user data
    this.userDataSubs = this._authService.userData.subscribe(userData => {
      if(!userData) return;
      if(userData.role?.name !== Roles.STAFF) this._router.navigateByUrl(RouteConstants.UNAUTHORIZED);

      this.userData = userData;
      this._globalService.hideLoader();

      this.fetchClinicTemplates();
    });
  }

  fetchClinicTemplates(){
    this.templateSubs = this._templateService.fetchTemplatesAsync(this.userData?.clinicId!)
      .subscribe({
        next: (templates: Template[]) => {
          this.templates = templates;
        },
        error: (err: any) => {
          this._errorService.handleError(err);
        }
      });
  }

  onUpdateTemplate(template: Template){
    !template.id ? this.saveTemplate(template) : this.updateTemplate(template);
  }

  async saveTemplate(template: Template){
    this._globalService.showLoader('Saving template...');

    await this._templateService.saveTemplate(template)
      .then(async (res) => {
        this._globalService.hideLoader();
        if(!res) return;
        this._globalService.showToast("Template has been saved.", 3000, ColorConstants.SUCCESS)
      })
      .catch(e => {
        this._errorService.handleError(e);
      });
  }
  
  async updateTemplate(template: Template){
    await this._templateService.updateTemplate(template)
    .then(async () => {
      this._globalService.hideLoader()
      this._globalService.showToast("Template has been updated.", 3000, ColorConstants.SUCCESS);
    })
    .catch((e) => {
      this._errorService.handleError(e);
    });
  }

  ngOnDestroy(): void {
    this.templateSubs?.unsubscribe();
  }
}
