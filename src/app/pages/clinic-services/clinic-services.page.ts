import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RefresherCustomEvent, ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AddClinicServiceComponent } from 'src/app/components/modals/add-clinic-service/add-clinic-service.component';
import { GenericComponent } from 'src/app/components/modals/generic/generic.component';
import { AlertTypeEnum } from 'src/app/constants/alert-logo.enum';
import { ColorConstants } from 'src/app/constants/color.constants';
import { DefaultFileNames } from 'src/app/constants/default-file-names.constants';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { Roles } from 'src/app/constants/roles.constants';
import { RootDirectory } from 'src/app/constants/root-directories.constants';
import { RouteConstants } from 'src/app/constants/route.constants';
import { ClinicServiceData } from 'src/app/models/clinic-service-data.model';
import { Clinic } from 'src/app/models/clinic.model';
import { GenericData } from 'src/app/models/generic-data.model';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { ClinicServicesService } from 'src/app/services/clinic-services.service';
import { ClinicService } from 'src/app/services/clinic.service';
import { ErrorService } from 'src/app/services/error.service';
import { FileService } from 'src/app/services/file.service';
import { GlobalService } from 'src/app/services/global.service';
import { TrailService } from 'src/app/services/trail.service';

@Component({
  selector: 'app-clinic-services',
  templateUrl: './clinic-services.page.html',
  styleUrls: ['./clinic-services.page.scss'],
})
export class ClinicServicesPage implements OnInit, ViewWillEnter, OnDestroy {
  clinic: Clinic | undefined;
  userData: UserData | undefined;
  clinicServices: ClinicServiceData[] = [];
  selectedClinicService: ClinicServiceData | undefined;
  userDataSubs: Subscription | undefined;

  constructor(
    private _authService: AuthService,
    private _clinicService: ClinicService,
    private _clinicServicesService: ClinicServicesService,
    private _fileService: FileService,
    private _globalService: GlobalService,
    private _trailService: TrailService,
    private _router: Router,
    private _errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this._globalService.showLoader('Page loading...');

    // Load user data
    this.userDataSubs = this._authService.userData.subscribe(async userData => {
      if(!userData) return;
      if(userData.role?.name !== Roles.STAFF) this._router.navigateByUrl(RouteConstants.UNAUTHORIZED);

      this.userData = userData;
      this._globalService.hideLoader();
      
      await this.reloadData();
    });
  }

  async ionViewWillEnter(): Promise<void> {
    if(!this.userData) return;

    await this.reloadData();
  }

  async reloadData(){
    await this.fetchClinic();

    if(!this.clinic) return;
    this.fetchClinicServices();
  }

  async fetchClinic(){
    const clinicId = this.userData?.clinicId;
    if(!clinicId) { return; };
    
    this._globalService.showLoader('Fetching clinic info...');
    this.clinic = await this._clinicService.fetchClinicById(clinicId) ?? undefined;
    this.selectedClinicService = undefined;
    this._globalService.hideLoader();
  }
  
  async onRefresh(event: RefresherCustomEvent){
    await this.fetchClinicServices();
    event.target.complete();
  }

  async fetchClinicServices(): Promise<void> {
    this._globalService.showLoader('Loading clinics...');
    this.clinicServices = await this._clinicServicesService.fetchClinicServices(this.clinic?.id!);
    this._globalService.hideLoader();
  }

  onAddClinicService() {
    this.openAddClinicServiceModal();
  }

  onUpdateClinicService(clinicService: ClinicServiceData){
    this.selectedClinicService = clinicService;
    const data = { clinicService }
    this.openAddClinicServiceModal(data);
  }

  async openAddClinicServiceModal(data?: any) {
    try {
      const options = {
        component: AddClinicServiceComponent,
        swipeToClose: false,
        canDismiss: true,
        backdropDismiss: true,
        componentProps: { data },
      };
      
      const clinicServiceRes = await this._globalService.createModal(options);
      if(!clinicServiceRes) return;

      if(!data && this.checkIfServiceExists(clinicServiceRes.name)){
        this._globalService.showToast('Service name already exists.');
        return;
      }
      
      const image = clinicServiceRes.image;
      const action = `${data ? ModifierActions.UPDATED : ModifierActions.ADDED} Clinic Service ${clinicServiceRes.name}`;
      
      let clinicService: ClinicServiceData = {
        name: clinicServiceRes.name,
        description: clinicServiceRes.description,
        price: clinicServiceRes.price,
        imageUrl: this.selectedClinicService?.imageUrl ?? this.getDefaultImagePath(),
        clinicId: this.clinic?.id!,
        ...(data ? this._trailService.updateAudit(action) : this._trailService.createAudit(action))
      }

      // Upload image if there's an image
      if(image) {
        const fullImagePath = this.getFullImagePath(this.clinic?.id!, clinicServiceRes.name, image.name);
        const imageUrlRes = await this.uploadImage(fullImagePath, image);
        if(imageUrlRes) {
          clinicService = {
            ...clinicService,
            imagePath: fullImagePath,
            imageUrl: imageUrlRes
          }
        }
      }

      data ? await this.updateClinicService(this.selectedClinicService?.id!, clinicService) : await this.saveClinicService(clinicService);
    } catch(e) {
      this._errorService.handleError(e);
    }
  }

  checkIfServiceExists(serviceName: string): boolean {
    return this.clinicServices.find(x => x.name.toLocaleLowerCase() === serviceName.toLocaleLowerCase()) != null ? true : false;
  }
  
  getFullImagePath(clinicId: string, serviceName: string, fileName: string): string {
    return `${RootDirectory.CLINIC_SERVICES}/${clinicId}/${serviceName}/${fileName}`;
  }

  getDefaultImagePath(): string{
    return `../../../../assets/images/${RootDirectory.CLINIC_SERVICES}/${DefaultFileNames.CLINIC_SERVICE}`;
  }

  async saveClinicService(clinicService: ClinicServiceData){
    this._globalService.showLoader('Saving new service...');
    
    await this._clinicServicesService.saveClinicService(clinicService)
    .then(async (clinicServiceId) => {
      this._globalService.hideLoader();
      await this.fetchClinicServices();
      this._globalService.showToast(`New clinic service has been saved.`, 3000, ColorConstants.SUCCESS);
    })
    .catch(e => {
      this._errorService.handleError(e);
    });
  }

  async updateClinicService(id: string, clinicService: ClinicServiceData) {
    this._globalService.showLoader('Updating clinic service...');
    clinicService = { id, ...clinicService };

    await this._clinicServicesService.updateClinicService(clinicService)
      .then(async () => {
        this._globalService.hideLoader()
        await this.fetchClinicServices();
        this._globalService.showToast(`Clinic service has been updated.`, 3000, ColorConstants.SUCCESS);
      })
      .catch((e) => {
        this._errorService.handleError(e);
      });
  }

  async uploadImage(path: string, file: File): Promise<string | null>{
    return await this._fileService.uploadFile(path, file)
      .then(async (imageUrl) => {
        return imageUrl;
      })
      .catch((e) => {
        this._errorService.handleError(e);
        return null;
      });
  }

  onDeleteClinicService(clinicService: ClinicServiceData){
    this._globalService.showAlert(
      AlertTypeEnum.CONFIRM, 
      `Are you sure you delete ${clinicService.name}?`,
      [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, 
        {
          text: 'Okay',
          handler: async () => {
            await this.deleteClinicService(clinicService)
          }
        }
      ]
    )
  }

  async deleteClinicService(clinicService: ClinicServiceData){
    this._globalService.showLoader('Deleting service...');
    const action = `${ModifierActions.ARCHIVED} Clinic Service ${clinicService.name}`;
    const updatedModel = {
      id: clinicService.id,
      imageUrl: this.getDefaultImagePath(),
      imagePath: null,
      ...this._trailService.deleteAudit(action)
    }

    await this._clinicServicesService.updateClinicService(updatedModel)
      .then(async () => {
        this._globalService.hideLoader()

        if(clinicService.imagePath) await this.deleteImage(clinicService.imagePath);

        await this.fetchClinicServices();
        this._globalService.showToast("Service has been deleted.", 3000, ColorConstants.SUCCESS);
      })
      .catch((e) => {
        this._errorService.handleError(e);
      });
  }

  async deleteImage(imagePath: string): Promise<void>{
    await this._fileService.deleteFile(imagePath)
      .then(async () => {
      })
      .catch((e) => {
        this._errorService.handleError(e);
      });
  }

  async onSeeMore(clinicService: ClinicServiceData){
    const genericData: GenericData = {
      title: clinicService.name,
      subtitle: clinicService.price.toString(),
      description: clinicService.description,
      imageUrl: clinicService.imageUrl
    }
    try {
      const options = {
        component: GenericComponent,
        swipeToClose: false,
        canDismiss: true,
        backdropDismiss: true,
        cssClass: 'generic-modal',
        componentProps: { data: genericData },
      };
      
      await this._globalService.createModal(options);
    } catch(e) {
      this._errorService.handleError(e);
    }
  }

  ngOnDestroy(): void {
    this.userDataSubs?.unsubscribe();
  }
}
